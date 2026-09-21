const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

// Obsidian: a near-black surface with a slowly deforming height field, lit by a
// wandering light that follows the pointer. Specular highlights are tinted gold;
// a broad diagonal sheen sweeps across every few seconds. Fine grain avoids banding.
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uScroll;
  varying vec2 vUv;

  float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
    return v;
  }
  float height(vec2 p, float t) {
    return fbm(p * 1.15 + vec2(t * 0.3, -t * 0.2) + vec2(0.0, uScroll * 0.3));
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    float t = uTime * 0.07;

    float e = 0.006;
    float h  = height(p, t);
    float hx = height(p + vec2(e, 0.0), t);
    float hy = height(p + vec2(0.0, e), t);
    vec3 n = normalize(vec3((h - hx) / e * 0.09, (h - hy) / e * 0.09, 1.0));

    vec3 lightPos = vec3(uMouse.x * 1.1 + sin(t * 1.7) * 0.5, uMouse.y * 0.7 + cos(t * 1.1) * 0.35 + 0.25, 1.3);
    vec3 L = normalize(lightPos - vec3(p, 0.0));
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float ndh = max(dot(n, H), 0.0);
    float specTight = pow(ndh, 140.0);
    float specSoft  = pow(ndh, 9.0);

    // sweeping sheen band, diagonal, every ~9s
    float d = dot(p, normalize(vec2(1.0, 0.55)));
    float pos = mod(t * 1.35, 4.0) - 2.0;
    float band = exp(-pow((d - pos) * 2.6, 2.0));

    vec3 base = vec3(0.027, 0.027, 0.03);
    vec3 gold = vec3(0.79, 0.64, 0.36);
    vec3 col = base + vec3(h * 0.02);
    col += gold * specTight * 0.34;
    col += vec3(0.95, 0.92, 0.86) * specSoft * 0.05;
    col += gold * band * 0.03 * (0.5 + 0.5 * specSoft);

    float vig = smoothstep(1.45, 0.25, length(p));
    col *= mix(0.72, 1.0, vig);
    col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.014;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initObsidian(canvas: HTMLCanvasElement): boolean {
  let gl: WebGLRenderingContext;
  try {
    const attributes: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    };
    const context = canvas.getContext('webgl', attributes)
      ?? canvas.getContext('experimental-webgl', attributes);
    if (!(context instanceof WebGLRenderingContext)) {
      throw new Error('A WebGL context is unavailable.');
    }
    gl = context;
  } catch (error: unknown) {
    console.error('Obsidian WebGL initialisation failed; using the CSS surface.', error);
    document.documentElement.classList.add('no-gl');
    return false;
  }

  const scale = 0.66; // render below native resolution: the surface is soft, the savings are large
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let vertexShader: WebGLShader | null = null;
  let fragmentShader: WebGLShader | null = null;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let uniforms: {
    time: WebGLUniformLocation;
    resolution: WebGLUniformLocation;
    mouse: WebGLUniformLocation;
    scroll: WebGLUniformLocation;
  } | null = null;
  let time = 0;
  let mouseX = 0.35;
  let mouseY = 0.2;
  let targetX = 0.35;
  let targetY = 0.2;
  let scroll = 0;
  let frameId: number | null = null;
  let disposed = false;
  let contextUnavailable = false;
  let last = performance.now();

  function compileShader(shader: WebGLShader, source: string): void {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Obsidian shader compilation failed: ' + gl.getShaderInfoLog(shader));
    }
  }

  function uniformLocation(linkedProgram: WebGLProgram, name: string): WebGLUniformLocation {
    const location = gl.getUniformLocation(linkedProgram, name);
    if (location === null) {
      throw new Error('Obsidian shader is missing uniform ' + name + '.');
    }
    return location;
  }

  function sizeSurface(): void {
    if (uniforms === null) {
      throw new Error('Obsidian uniforms are unavailable.');
    }
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5) * scale;
    canvas.width = Math.floor(window.innerWidth * pixelRatio);
    canvas.height = Math.floor(window.innerHeight * pixelRatio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
  }

  function createResources(): void {
    const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    const precisionPrologue = precision !== null && precision.precision > 0
      ? 'precision highp float;'
      : 'precision mediump float;';
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (vertexShader === null) throw new Error('Obsidian vertex shader allocation failed.');
    compileShader(vertexShader, precisionPrologue + '\nattribute vec3 position;\nattribute vec2 uv;\n' + vert);
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (fragmentShader === null) throw new Error('Obsidian fragment shader allocation failed.');
    // Keep the original GLSL intact; its first declaration is supplied by the precision prologue.
    compileShader(fragmentShader, precisionPrologue + frag.slice(frag.indexOf(';') + 1));

    program = gl.createProgram();
    if (program === null) throw new Error('Obsidian program allocation failed.');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // Fixed slots also let us bind UVs when the unused varying is optimised away.
    gl.bindAttribLocation(program, 0, 'position');
    gl.bindAttribLocation(program, 1, 'uv');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Obsidian program linking failed: ' + gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);
    uniforms = {
      time: uniformLocation(program, 'uTime'),
      resolution: uniformLocation(program, 'uRes'),
      mouse: uniformLocation(program, 'uMouse'),
      scroll: uniformLocation(program, 'uScroll'),
    };

    buffer = gl.createBuffer();
    if (buffer === null) throw new Error('Obsidian vertex buffer allocation failed.');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,  1, 0, 0, 1,
      -1, -1, 0, 0, 0,
       1,  1, 0, 1, 1,
      -1, -1, 0, 0, 0,
       1, -1, 0, 1, 0,
       1,  1, 0, 1, 1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    // The opaque quad covers every pixel, so it does not need a separate clear.
    sizeSurface();
    const error = gl.getError();
    if (error !== gl.NO_ERROR) throw new Error('Obsidian WebGL setup failed: ' + error);
  }

  function deleteResources(): void {
    // After context loss these deletes are harmless; clear the handles before rebuilding.
    if (program !== null) gl.deleteProgram(program);
    if (vertexShader !== null) gl.deleteShader(vertexShader);
    if (fragmentShader !== null) gl.deleteShader(fragmentShader);
    if (buffer !== null) gl.deleteBuffer(buffer);
    program = null;
    vertexShader = null;
    fragmentShader = null;
    buffer = null;
    uniforms = null;
  }

  function pointerMoved(e: PointerEvent): void {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  function resize(): void {
    // A restored context gets its current size when its resources are rebuilt.
    if (disposed || contextUnavailable) return;
    try {
      sizeSurface();
    } catch (error: unknown) {
      console.error('Obsidian resizing failed; using the CSS surface.', error);
      document.documentElement.classList.add('no-gl');
      dispose();
    }
  }

  function stop(): void {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
  }

  function dispose(): void {
    // Permanent teardown is idempotent; context loss keeps the restoration listener.
    if (disposed) return;
    disposed = true;
    stop();
    window.removeEventListener('pointermove', pointerMoved);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', visibilityChanged);
    canvas.removeEventListener('webglcontextlost', contextLost);
    canvas.removeEventListener('webglcontextrestored', contextRestored);
    deleteResources();
  }

  function suspendForContextLoss(): void {
    // A draw can detect the loss before its event is dispatched.
    if (contextUnavailable) return;
    contextUnavailable = true;
    console.error('Obsidian WebGL context lost; using the CSS surface.');
    document.documentElement.classList.add('no-gl');
    stop();
    deleteResources();
  }

  function contextLost(event: Event): void {
    event.preventDefault();
    suspendForContextLoss();
  }

  function contextRestored(): void {
    // Ignore duplicate restoration notifications or a permanently disposed surface.
    if (disposed || !contextUnavailable) return;
    try {
      createResources();
    } catch (error: unknown) {
      console.error('Obsidian WebGL restoration failed; using the CSS surface.', error);
      document.documentElement.classList.add('no-gl');
      deleteResources();
      return;
    }
    contextUnavailable = false;
    last = performance.now();
    document.documentElement.classList.remove('no-gl');
    if (reduced) {
      // Replace the lost still frame without starting an animation.
      render();
    } else {
      schedule();
    }
  }

  function schedule(): void {
    // Hidden pages, lost contexts and an already pending frame need no new request.
    if (!disposed && !contextUnavailable && !document.hidden && frameId === null) {
      frameId = requestAnimationFrame(frame);
    }
  }

  function visibilityChanged(): void {
    if (document.hidden) stop();
    else {
      last = performance.now();
      schedule();
    }
  }

  function render(): boolean {
    try {
      if (gl.isContextLost()) {
        suspendForContextLoss();
        return false;
      }
      if (uniforms === null) throw new Error('Obsidian uniforms are unavailable.');
      gl.uniform1f(uniforms.time, time);
      gl.uniform2f(uniforms.mouse, mouseX, mouseY);
      gl.uniform1f(uniforms.scroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      // No per-frame gl.getError(): it forces a synchronous flush every frame, and after a
      // successful setup the only failure a fixed draw call can hit is context loss.
      if (gl.isContextLost()) {
        suspendForContextLoss();
        return false;
      }
      return true;
    } catch (error: unknown) {
      console.error('Obsidian rendering failed; using the CSS surface.', error);
      document.documentElement.classList.add('no-gl');
      dispose();
      return false;
    }
  }

  function frame(now: number): void {
    frameId = null;
    // Visibility or context loss can change after a frame has been requested.
    if (disposed || contextUnavailable || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;
    scroll += ((window.scrollY / window.innerHeight) - scroll) * 0.06;
    if (render()) schedule();
    // A failed render has already stopped the loop and selected the CSS surface.
  }

  try {
    createResources();
  } catch (error: unknown) {
    console.error('Obsidian WebGL initialisation failed; using the CSS surface.', error);
    document.documentElement.classList.add('no-gl');
    dispose();
    return false;
  }
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);
  if (reduced) {
    // One frame only; CSS scales it on resize, with the sheen centred at this fixed time.
    time = 21;
    return render();
  }
  window.addEventListener('pointermove', pointerMoved, { passive: true });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', visibilityChanged);
  // The animation lasts for the visible page lifetime; hiding or losing WebGL cancels it.
  schedule();
  return true;
}
