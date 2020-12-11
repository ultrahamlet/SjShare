//:1aa,0a,0va,2v
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (1.0/32.0)*fragCoord/iResolution.xy;
    vec2 uv2 = fragCoord.xy/iResolution.xy;
    vec4 a = texture(iChannel0, uv);
    vec4 b = texture(iChannel0, vec2(uv.x+0.5,uv.y));
    
    vec4 c = a-b;
    c *= c*4.0;
    
    //fragColor = texture(iChannel2,fragCoord/iResolution.xy);
    fragColor = c+texture(iChannel2,fragCoord/iResolution.xy);
}