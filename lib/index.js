function initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE); // vertex
  gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE); // fragment

  // shader
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  // program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  return program;
}
