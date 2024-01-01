var gl = gl || {};

gl.createTexture = function() {

    var ret = gl._createTexture();
    return { texture_id:ret };
};

gl.createBuffer = function() {

    var ret = gl._createBuffer();
    return { buffer_id:ret };
};

gl.createRenderbuffer = function() {

    var ret = gl._createRenderuffer();
    return { renderbuffer_id:ret};
};

gl.createFramebuffer = function() {

    var ret = gl._createFramebuffer();
    return {framebuffer_id:ret};
};

gl.createProgram = function() {

    var ret = gl._createProgram();
    return {program_id:ret};
};

gl.createShader = function(shaderType) {

    var ret = gl._createShader(shaderType);
    return {shader_id:ret};
};

gl.deleteTexture = function(texture) {
    var texture_id = texture.texture_id;

    if( typeof texture === 'number' )
        texture_id = texture;

    gl._deleteTexture(texture_id);
};

gl.deleteBuffer = function(bufer) {
    var buffer_id = buffer.buffer_id;

    if( typeof buffer === 'number' )
        buffer_id = buffer;

    gl._deleteBuffer(buffer_id);
};

gl.deleteRenderbuffer = function(bufer) {
    var buffer_id = buffer.renderbuffer_id;

    if( typeof buffer === 'number' )
        buffer_id = buffer;

    gl._deleteRenderbuffer(renderbuffer_id);
};

gl.deleteFramebuffer = function(bufer) {
    var buffer_id = buffer.framebuffer_id;

    if( typeof buffer === 'number' )
        buffer_id = buffer;

    gl._deleteFramebuffer(buffer_id);
};

gl.deleteProgram = function(program) {
    var program_id = program.program_id;

    if( typeof program === 'number' )
        program_id = program;

    gl._deleteProgram(program_id);
};

gl.deleteShader = function(shader) {
    var shader_id = shader.shader_id;

    if( typeof shader === 'number' )
        shader_id = shader;

    gl._deleteShader(shader_id);
};

gl.bindTexture = function(target, texture) {

    var texture_id;

    if( typeof texture === 'number' )
        texture_id = texture;
    else if( texture === null )
        texture_id = 0;
    else
        texture_id = texture.texture_id;

    gl._bindTexture( target, texture_id );
};

gl.bindBuffer = function(target, buffer) {
    var buffer_id;

    if( typeof buffer === 'number' )
        buffer_id = buffer;
    else if( buffer === null )
        buffer_id = 0;
    else
        buffer_id = buffer.buffer_id;

    gl._bindBuffer(target, buffer_id);
};

gl.bindRenderBuffer = function(target, buffer) {
    var buffer_id;

    if( typeof buffer === 'number' )
        buffer_id = buffer;
    else if( buffer === null )
        buffer_id = 0;
    else
        buffer_id = buffer.buffer_id;

    gl._bindRenderbuffer(target, buffer_id);
};

gl.bindFramebuffer = function(target, buffer) {
    var buffer_id;

    if( typeof buffer === 'number' )
        buffer_id = buffer;
    else if( buffer === null )
        buffer_id = 0;
    else
        buffer_id = buffer.buffer_id;

    gl._bindFramebuffer(target, buffer_id);
};

gl.getUniform = function(program, location) {
    var program_id;
    var location_id;

    if( typeof program === 'number' )
        program_id = program;
    else
        program_id = program.program_id;

    if( typeof location === 'number' )
        location_id = location;
    else
        location_id = location.location_id;

    return gl._getUniform(program_id, location_id);
};

gl.compileShader = function(shader) {
    gl._compileShader( shader.shader_id);
};

gl.shaderSource = function(shader, source) {
    gl._shaderSource(shader.shader_id, source);
};

gl.getShaderParameter = function(shader, e) {
    return gl._getShaderParameter(shader.shader_id,e);
};

gl.getShaderInfoLog = function(shader) {
    return gl._getShaderInfoLog(shader.shader_id);
};

gl.attachShader = function(program, shader) {
    var program_id = program.program_id;

    if( typeof program === 'number' )
        program_id = program;

    gl._attachShader(program_id, shader.shader_id);
};

gl.linkProgram = function(program) {
    var program_id = program.program_id;

    if( typeof program === 'number' )
        program_id = program;

    gl._linkProgram(program_id);
};

gl.getProgramParameter = function(program, e) {
    var program_id = program.program_id;

    if( typeof program === 'number' )
        program_id = program;

    return gl._getProgramParameter(program_id, e);
};

gl.useProgram = function(program) {
    var program_id;

    if( typeof program === 'number' )
        program_id = program;
    else
        program_id = program.program_id;

    gl._useProgram (program_id);
};

gl.getAttribLocation = function(program, name) {
    var program_id = program.program_id;

    if( typeof program === 'number' )
        program_id = program;

    return gl._getAttribLocation(program_id, name);
};

gl.getUniformLocation = function(program, name) {
    var program_id = program.program_id;

    if( typeof program === 'number' )
        program_id = program;

    return gl._getUniformLocation(program_id,name);
};

gl.getActiveAttrib = function(program, index) {
    var program_id = program.program_id;

    if( typeof program === 'number' )
        program_id = program;

    return gl._getActiveAttrib(program_id, index);
};

gl.getActiveUniform = function(program, index) {
    var program_id = program.program_id;

    if( typeof program === 'number' )
        program_id = program;

    return gl._getActiveUniform(program_id, index);
};

gl.getAttachedShaders = function(program) {
    var program_id = program.program_id;

    if( typeof program === 'number' )
        program_id = program;

    return gl._getAttachedShaders(program_id);
};

gl.texImage2D = function() {
    if( arguments.length !=  9)
        throw "texImage2D: Unsupported number of parameters:" + arguments.length;

    gl._texImage2D.apply(this, arguments);
};

gl.texSubImage2D = function() {
    if( arguments.length !=  9)
        throw "texImage2D: Unsupported number of parameters";

    gl._texSubImage2D.apply(this, arguments);
};

gl.getExtension = function(extension) {
    var extensions = gl.getSupportedExtensions();
    if( extensions.indexOf(extension) > -1 )
        return {};
    return null;
};