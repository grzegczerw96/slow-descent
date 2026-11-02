// The camera of the film versions: real footage seen through a virtual camera in WebGL, inside a frame that can move.
//  - the operator: keyframes per shot, a slow float that never stops, and water's inertia (the picture lags behind the
//    scroll and settles after it)
//  - the surroundings: the water around the swimmer moves apart from her, by the depth strip under the picture
//  - the grade: one mono ramp moving from silver with navy shadows to water colour, or the shot's own colour turned cold
//  - the frame (state.win): where on the screen the picture is; outside it the page's navy. Cinema bars, a window beside
//    the text and the full screen are all this one rectangle
// One shot dissolves into the next, or through navy where nothing is behind it. No filter and no grain: only the footage.
window.Film = (() => {
  const VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
  const FS = `precision highp float;
    uniform sampler2D uTex0, uTex1;
    uniform vec2 uRes;
    uniform vec4 uCam0, uCam1;      // x, y, zoom, roll
    uniform vec4 uMap0, uMap1;      // view scale x, y, depth strip (0/1), keep colour
    uniform vec2 uAmt, uG;          // how much of each shot; grade of each shot
    uniform vec2 uPar;              // surroundings' shift
    uniform vec4 uWin;              // the frame on the screen, 0..1, top left to bottom right
    uniform float uT, uDim, uVig, uSil;
    float lum(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
    vec3 st(float L, float a, vec3 A, float b, vec3 B){ return mix(A, B, clamp((L-a)/(b-a), 0., 1.)); }
    // sample 2: navy only in the shadows, silver lights
    vec3 rampA(float L){
      if (L < .15) return st(L, 0., vec3(.01,.03,.07), .15, vec3(.05,.08,.15));
      if (L < .5)  return st(L, .15, vec3(.05,.08,.15), .5, vec3(.42,.46,.53));
      if (L < .9)  return st(L, .5, vec3(.42,.46,.53), .9, vec3(.93,.95,.97));
      return st(L, .9, vec3(.93,.95,.97), 1., vec3(1.));
    }
    // sample 4: navy shadows, the lights go into water
    vec3 rampB(float L){
      if (L < .2) return st(L, 0., vec3(.02,.05,.13), .2, vec3(.05,.13,.25));
      if (L < .5) return st(L, .2, vec3(.05,.13,.25), .5, vec3(.20,.40,.52));
      if (L < .9) return st(L, .5, vec3(.20,.40,.52), .9, vec3(.72,.88,.92));
      return st(L, .9, vec3(.72,.88,.92), 1., vec3(.92,.98,.98));
    }
    // a shot's own colour with the warmth taken out: no warm light on this page
    vec3 cold(vec3 c){
      float L = lum(c), cap = mix(c.g, c.b, .5)*1.02;
      c.r = mix(c.r, min(c.r, cap), .9); c.g = min(c.g, c.b*1.12 + .02);
      return mix(vec3(L), c, 1.02)*vec3(.97,1.,1.03);
    }
    vec3 shot(sampler2D tex, vec4 cam, vec4 map, float g){
      vec2 f = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y)/uRes;
      float wh = uWin.w - uWin.y;
      vec2 p = (f - vec2(.5*(uWin.x + uWin.z), .5*(uWin.y + uWin.w)))/wh*vec2(uRes.x/uRes.y, 1.);
      float c = cos(cam.w), s = sin(cam.w);
      p = vec2(c*p.x - s*p.y, s*p.x + c*p.y);
      vec2 uv = cam.xy + p*map.xy/cam.z;
      float near = 1.;
      if (map.z > .5) {
        // the depth strip: 1 on her body, softened; the water around moves, she does not
        near = texture2D(tex, vec2(uv.x, .8 + clamp(uv.y, 0., 1.)*.2)).r;
        near = smoothstep(.05, .55, near);
        vec2 q = uv;
        uv += (1. - near)*(uPar + vec2(sin(q.y*19. + uT*.52 + q.x*5.), cos(q.x*15. - uT*.41 + q.y*7.))*.0013);
        uv.y *= .8;
      }
      uv = clamp(uv, vec2(.001), vec2(.999, map.z > .5 ? .799 : .999));
      vec3 col = texture2D(tex, uv).rgb;
      float L = lum(col);
      // her body stays a silhouette: the light on the skin is held down, the water keeps its own
      if (map.z > .5) L = mix(L, min(L, .3 + (L - .3)*.28), near*uSil);
      vec3 mono = mix(rampA(L), rampB(L), g);
      return mix(mono, cold(col), map.w);
    }
    void main(){
      vec3 navy = vec3(.039,.078,.141);
      vec2 f = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y)/uRes;
      if (f.x < uWin.x || f.x > uWin.z || f.y < uWin.y || f.y > uWin.w) { gl_FragColor = vec4(navy, 1.); return; }
      vec3 col = navy;
      if (uAmt.x > 0.) col = mix(col, shot(uTex0, uCam0, uMap0, uG.x), uAmt.x);
      if (uAmt.y > 0.) col = mix(col, shot(uTex1, uCam1, uMap1, uG.y), uAmt.y);
      vec2 v = (f - vec2(.5*(uWin.x + uWin.z), .5*(uWin.y + uWin.w)))/vec2(uWin.z - uWin.x, uWin.w - uWin.y);
      col *= 1. - dot(v, v)*uVig*max(uAmt.x, uAmt.y);
      col = mix(navy, col, uDim);
      gl_FragColor = vec4(col, 1.);
    }`;

  const { c01, lerp, ss } = Home;
  // through the keyframes with no stop at any of them: a camera in water never halts between two positions
  function path(keys, h, n) {
    if (h <= keys[0][0]) return keys[0][n];
    const L = keys.length - 1;
    if (h >= keys[L][0]) return keys[L][n];
    let i = 0; while (i < L - 1 && h > keys[i + 1][0]) i++;
    const a = keys[Math.max(0, i - 1)], b = keys[i], c = keys[i + 1], d = keys[Math.min(L, i + 2)];
    const dt = c[0] - b[0], t = (h - b[0]) / dt;
    const m1 = (c[n] - a[n]) / (c[0] - a[0] || 1) * dt, m2 = (d[n] - b[n]) / (d[0] - b[0] || 1) * dt;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * b[n] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * c[n] + (t3 - t2) * m2;
  }
  const amount = (o, h) => ss((h - o[0]) / (o[1] - o[0] || 1e-3)) * (o[3] === undefined ? 1 : 1 - ss((h - o[2]) / (o[3] - o[2] || 1e-3)));

  function create(canvas, shots, opts = {}) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const prog = gl.createProgram(); gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {}; for (const n of ['uTex0', 'uTex1', 'uRes', 'uCam0', 'uCam1', 'uMap0', 'uMap1', 'uAmt', 'uG', 'uPar', 'uWin', 'uT', 'uDim', 'uVig', 'uSil']) U[n] = gl.getUniformLocation(prog, n);
    const tex = (unit, wrap) => {
      const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 20, 36, 255]));
      return t;
    };
    const slots = [tex(0, gl.CLAMP_TO_EDGE), tex(1, gl.CLAMP_TO_EDGE)];
    gl.uniform1i(U.uTex0, 0); gl.uniform1i(U.uTex1, 1);

    // each shot plays from parts held in hidden videos
    const box = document.createElement('div'); box.style.cssText = 'position:absolute;width:2px;height:2px;overflow:hidden;opacity:0;pointer-events:none';
    canvas.parentElement.appendChild(box);
    const list = [];
    for (const s of shots) {
      s.movie = Home.stack(box, s.parts);
      for (const p of s.parts) { if (!list.find(x => x.src === p.src)) list.push(p); else p.v = list.find(x => x.src === p.src).v; }
      if (s.poster) { s.posterImg = new Image(); s.posterImg.onload = () => { s.posterOk = true; opts.onPoster && opts.onPoster(s); }; s.posterImg.src = s.poster; }
      s.last = -1; s.posted = false;
    }
    Home.load(list, opts.base, false);

    let W = 0, H = 0, dpr = 1;
    function size() {
      W = Home.W; H = Home.H; dpr = Math.min(devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
    }
    size();

    // the operator: float, breath and water's inertia
    const op = { lagY: 0, lagX: 0, roll: 0, fall: 0 };
    const state = { dim: 1, vig: .3, sil: .8, win: [0, 0, 1, 1], time: 0, h: 0 };
    function camera(s, h, t) {
      const asp = s.asp, w = state.win, sa = ((w[2] - w[0]) * W) / ((w[3] - w[1]) * H), V = sa > asp ? sa / asp : 1;
      const flo = s.float === undefined ? 1 : s.float;
      let z = path(s.cam, h, 3) * (1 + flo * .007 * Math.sin(t * .4));
      let x = path(s.cam, h, 1) + flo * (.0042 * Math.sin(t * .23 + 1.1) + .0024 * Math.sin(t * .41)) + op.lagX;
      let y = path(s.cam, h, 2) + flo * (.0058 * Math.sin(t * .29 + .4) + .0028 * Math.cos(t * .47)) + op.lagY;
      const roll = (s.cam[0][4] === undefined ? 0 : path(s.cam, h, 4)) + flo * .0042 * Math.sin(t * .17 + 2.) + op.roll;
      const mx = 1 / (asp * V), my = 1 / V;
      const hw = .5 * sa * mx / z + Math.abs(roll) * .5 * my / z, hh = .5 * my / z + Math.abs(roll) * .5 * sa * mx / z;
      x = Math.max(hw + .002, Math.min(1 - hw - .002, x)); y = Math.max(hh + .002, Math.min(1 - hh - .002, y));
      return { x, y, z, roll, mx, my, sa };
    }

    function frame(h, now) {
      const t = now / 1000; state.time = t; state.h = h;
      // the water holds the camera back: fast scrolling pulls the picture along and it settles when the scroll stops
      const v = Math.max(-60, Math.min(60, Home.lenis.velocity || 0));
      op.lagY += (v * -.00042 - op.lagY) * .045;
      op.roll += (v * .00011 - op.roll) * .03;
      op.fall = h;
      const act = shots.map(s => ({ s, a: amount(s.on, h) })).filter(x => x.a > .001);
      // the two topmost shots in play; a shot whose picture has not arrived stays out of the mix
      const use = act.slice(-2);
      const hasAny = [];
      use.forEach((x, i) => {
        const s = x.s, T = s.t(h, t);
        s.movie.scrub(T);
        const cur = s.movie.current;
        const unit = i;
        gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, slots[unit]);
        const changed = s.boundTo !== unit || slotShot[unit] !== s;
        let ok = false;
        if (cur && cur.v.readyState >= 2) {
          const vt = cur.v.currentTime + cur.t0;
          if (changed || (Math.abs(vt - s.last) > .001 && !cur.v.seeking)) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cur.v); s.last = vt; s.boundTo = unit; slotShot[unit] = s; s.drawn = true; }
          ok = s.drawn || slotShot[unit] === s;
        } else if (s.posterOk) {
          if (changed) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, s.posterImg); s.boundTo = unit; slotShot[unit] = s; }
          ok = true;
        }
        if (!ok) { x.a = 0; }
        const c = camera(s, h, t);
        s.view = c;
        gl.uniform4f(U['uCam' + unit], c.x, c.y, c.z, c.roll);
        gl.uniform4f(U['uMap' + unit], c.mx, c.my, s.depth ? 1 : 0, s.keep ? s.keep(h) : 0);
        hasAny.push(x.a);
      });
      gl.uniform2f(U.uAmt, hasAny[0] || 0, hasAny[1] || 0);
      const g0 = use[0] && use[0].s.g ? use[0].s.g(h) : 0, g1 = use[1] && use[1].s.g ? use[1].s.g(h) : 0;
      gl.uniform2f(U.uG, g0, g1);
      // the surroundings wander with the depth and on their own, slowly
      gl.uniform2f(U.uPar, .0075 * Math.sin(h * .85 + t * .06) + .0028 * Math.sin(t * .13), .0095 * Math.cos(h * 1.15 + t * .05) + op.lagY * .7);
      const w = state.win; gl.uniform4f(U.uWin, w[0], w[1], w[2], w[3]);
      gl.uniform1f(U.uT, t); gl.uniform1f(U.uDim, state.dim); gl.uniform1f(U.uVig, state.vig); gl.uniform1f(U.uSil, state.sil);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    const slotShot = [null, null];

    // where a tracked person is on the screen now
    function subject(h) {
      for (const s of [...shots].reverse()) {
        if (amount(s.on, h) < .3 || !s.track || !s.view) continue;
        const T = s.t(h, performance.now() / 1000), o = s.track(T); if (!o) return null;
        const c = s.view, w = state.win, wh = (w[3] - w[1]) * H, map = (u, v) => [(w[0] + w[2]) / 2 * W + (u - c.x) * c.z / c.mx * wh, (w[1] + w[3]) / 2 * H + (v - c.y) * c.z / c.my * wh];
        const [l, tp] = map(o[0], o[1]), [r, b] = map(o[2], o[3]);
        return { left: l, top: tp, right: r, bottom: b, name: s.name || 'postać' };
      }
      return null;
    }
    return { frame, size, state, subject, shots };
  }
  return { create, amount };
})();
