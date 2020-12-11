//:0v
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
vec2 uv = fragCoord.xy / iResolution.xy;

vec4 col0 = vec4(texture(iChannel0, uv).xyz, 1.0);

fragColor = col0;
}