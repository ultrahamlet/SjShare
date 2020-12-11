//:1fa,1a,0v
const float FXAA_SPAN_MAX = 8.0;
const float FXAA_REDUCE_MUL = 1.0 / 8.0;
const float FXAA_SUBPIX_SHIFT = 1.0 / 4.0;

#define FxaaInt2 vec2
#define FxaaFloat2 vec2
//#define FxaaTexLod0(t, p) textuer2DLod(t, p, 0.0)
//#define FxaaTexOff(t, p, o, r) texture2DLodOffset(t, p, 0.0, o)
#define FxaaTexLod0(t, p) texture(t, p)
#define FxaaTexOff(t, p, o, r) texture(t, p + o * r)

vec3 FxaaPixelShader(
    vec4 posPos, // Output of FxaaVertexShader interpolated accross screen.
    sampler2D tex, // Input texture.
    vec2 rcpFrame) // Constant { 1.0 / frameWidth, 1.0 / frameHeight }
{
    #define FXAA_REDUCE_MIN (1.0 / 128.0)
    
    vec3 rgbNW = FxaaTexLod0(tex, posPos.zw).xyz;
    vec3 rgbNE = FxaaTexOff(tex, posPos.zw, FxaaInt2(1, 0), rcpFrame.xy).xyz;
    vec3 rgbSW = FxaaTexOff(tex, posPos.zw, FxaaInt2(0, 1), rcpFrame.xy).xyz;
    vec3 rgbSE = FxaaTexOff(tex, posPos.zw, FxaaInt2(1, 1), rcpFrame.xy).xyz;
    vec3 rgbM = FxaaTexLod0(tex, posPos.xy).xyz;
    
    vec3 luma = vec3(0.299, 0.587, 0.114);
    
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM = dot(rgbM, luma);
    
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
    
    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));
    
    float dirReduce = max(
        (lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL),
        FXAA_REDUCE_MIN);
    
    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(FxaaFloat2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(FxaaFloat2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                  dir * rcpDirMin)) * rcpFrame.xy;
    
    vec3 rgbA = (1.0 / 2.0) * (
        FxaaTexLod0(tex, posPos.xy + dir * (1.0 / 3.0 - 0.5)).xyz +
        FxaaTexLod0(tex, posPos.xy + dir * (2.0 / 3.0 - 0.5)).xyz);
    
    vec3 rgbB = rgbA * (1.0 / 2.0) + (1.0 / 4.0) * (
        FxaaTexLod0(tex, posPos.xy + dir * (0.0 / 3.0 - 0.5)).xyz +
        FxaaTexLod0(tex, posPos.xy + dir * (3.0 / 3.0 - 0.5)).xyz);
    
    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
    {
        return rgbA;
    }
    else
    {
        return rgbB;
    }
}

/*
 * "Toon webcam" by Ben Wheatley - 2018
 * License MIT License
 * Contact: github.com/BenWheatley
 */


mat3 k1 = mat3( -1,  -1,  -1,
                -1, 8,  -1,
                -1,  -1,  -1);

vec3 posterize(vec3 col, int rCount, int gCount, int bCount) {
    float fColR = float(rCount);
    float fColG = float(gCount);
    float fColB = float(bCount);
    int r = int(fColR*col.r);
    int g = int(fColG*col.g);
    int b = int(fColB*col.b);
    return vec3( float(r)/fColR, float(g)/fColG, float(b)/fColB );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //
    vec2 R = iResolution.xy;
	vec2 uv = fragCoord.xy / iResolution.xy;
	vec4 c = vec4(0.0);
    vec2 rcpFrame = vec2(1.0 / R.x, 1.0 / R.y);
    vec2 texCoord = uv;
    vec4 posPos = vec4(texCoord, texCoord - rcpFrame * (0.5 + FXAA_SUBPIX_SHIFT));
    c.rgb = FxaaPixelShader(posPos, iChannel1, rcpFrame);
    c.a = 1.0;
    //
    float time = iTime;
    //vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec2 pixelSize = vec2(1,1) / iResolution.xy;
    
    vec3 sum = vec3(0,0,0);
    
    mat3 kernel = k1;
    
    for (int dy = -1; dy<=1; dy++) {
	    for (int dx = -1; dx<=1; ++dx) {
            vec2 pixelOff = pixelSize * vec2(dx, dy);
            vec2 tex_uv = uv + pixelOff;
            vec3 textureValue = texture(iChannel0, tex_uv).rgb;
            sum += (kernel[dx+1][dy+1] * textureValue);
        }
    }
    
    vec3 edge = sum;
    vec3 cam = posterize(texture(iChannel0, uv).rgb, 4, 4, 2);
    //vec4 col1 = vec4(texture(iChannel1, uv).xyz, 1.0);
    //vec4 col1 = c;
    //cam = cam + ((col1 == vec4(1.0,1.0,1.0,1.0))?0.9:0.0);
    //cam = cam + c;
    fragColor = vec4(cam + 0.5*edge,0.1) + c;
}







