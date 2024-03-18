/**
 * 创建 Shader
 * @param {WebGLRenderingContext} gl 
 * @param {*} type 
 * @param {*} source 
 * @returns 
 */
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

/**
 * 创建 Program
 * @param {WebGLRenderingContext} gl 
 * @param {*} vertexShader 
 * @param {*} fragmentShader 
 * @returns 
 */
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function main() {
    const canvas = document.createElement('canvas');
    document.getElementsByTagName('body')[0].appendChild(canvas);
    canvas.width = 400;
    canvas.height = 300;
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('ERR no gl object');
        return;
    }

    // 4个顶点
    const positions = [
        0, 0,
        0.7, 0,
        0, 0.5,
        0.7, 0.5,
    ];

    // 顶点颜色
    const colors = [
        255, 0, 0, 255, // R
        0, 255, 0, 255, // G
        0, 0, 255, 255, // B
        255, 127, 0, 255 // 
    ];

    gl.enable(gl.CULL_FACE);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);

    const indices = [
        0, 1, 2,
        2, 1, 3,
    ];

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // 顶点着色器
    const vertexSource = `
    attribute vec2 a_position;
    attribute vec4 a_color;

    varying vec4 v_color;

    void main(){
        v_color = a_color;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
    `;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);

    // 片段着色器
    const fragmentSource = `
    precision mediump float;

    varying vec4 v_color;

    void main(){
        gl_FragColor = v_color;
    }
    `;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    // 这里再次 bindBuffer 是将之前解绑的VBO重新绑定,告诉 attr 使用这个 VBO
    // Kimi: 简而言之，再次调用bindBuffer是为了确保vertexBuffer是当前上下文中gl.ARRAY_BUFFER目标的活跃绑定对象，这样gl.vertexAttribPointer就能正确地将顶点数据与顶点属性关联起来。
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const colorAttrbuteLocation = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorAttrbuteLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // 这里归一化传 true 表示将 255->1.0 传到 program?
    gl.vertexAttribPointer(colorAttrbuteLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0)

    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
}

console.log('This is a basic demo of WebGL shader.');
main();
