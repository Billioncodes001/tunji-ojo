import { WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, Mesh, ShaderMaterial, Vector2 } from 'three';

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
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  } catch (error: unknown) {
    console.error('Obsidian WebGL initialisation failed; using the CSS surface.', error);
    return false;
  }
  const scale = 0.66; // render below native resolution: the surface is soft, the savings are large
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5) * scale);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new Vector2(renderer.domElement.width, renderer.domElement.height) },
    uMouse: { value: new Vector2(0.35, 0.2) },
    uScroll: { value: 0 },
  };
  const material = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });
  const geometry = new PlaneGeometry(2, 2);
  scene.add(new Mesh(geometry, material));

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const target = new Vector2(0.35, 0.2);
  let frameId: number | null = null;
  let disposed = false;
  let last = performance.now();
  function pointerMoved(e: PointerEvent): void {
    target.set((e.clientX / window.innerWidth - 0.5) * 2, -(e.clientY / window.innerHeight - 0.5) * 2);
  }
  function resize(): void {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    uniforms.uRes.value.set(renderer.domElement.width, renderer.domElement.height);
  }
  function stop(): void {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
  }
  function dispose(): void {
    if (disposed) return;
    disposed = true;
    stop();
    window.removeEventListener('pointermove', pointerMoved);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', visibilityChanged);
    canvas.removeEventListener('webglcontextlost', contextLost);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  }
  function contextLost(event: Event): void {
    event.preventDefault();
    console.error('Obsidian WebGL context lost; using the CSS surface.');
    document.documentElement.classList.add('no-gl');
    dispose();
  }
  function schedule(): void {
    if (!disposed && !document.hidden && frameId === null) frameId = requestAnimationFrame(frame);
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
      renderer.render(scene, camera);
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
    if (disposed || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    uniforms.uTime.value += dt;
    uniforms.uMouse.value.lerp(target, 0.04);
    uniforms.uScroll.value += ((window.scrollY / window.innerHeight) - uniforms.uScroll.value) * 0.06;
    if (render()) schedule();
  }
  canvas.addEventListener('webglcontextlost', contextLost);
  if (reduced) {
    // One frame only; CSS scales it on resize, with the sheen centred at this fixed time.
    uniforms.uTime.value = 21;
    return render();
  }
  window.addEventListener('pointermove', pointerMoved, { passive: true });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', visibilityChanged);
  // The animation lasts for the visible page lifetime; hiding or losing WebGL cancels it.
  schedule();
  return true;
}
