//M:0v
#define DARK_EDGES

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    float aspect = iResolution.x/iResolution.y;
   	vec2 disorsion = uv-.5;
    
    disorsion.x*=aspect; // aspect correction
    
    // take distance from center
   	float len = length(disorsion);
    
    // these are the lens parameters
    float k1 = 1.2;
    float k2 = 1.0*iMouse.x/iResolution.x;
    float k3 = -3.2;
    
    disorsion 
        = disorsion*k1 
        + disorsion*len*k2 
        + disorsion*len*len*k3;
        // higher powers may be added if necessary
    
    
    disorsion.x/=aspect; // aspect correction
    
    vec4 col = texture(iChannel0, disorsion+.5);
    
    #ifdef DARK_EDGES
    {
        float edge = 0.7;
        float dispersion = 0.03;
    	col *= vec4(
            pow(max(edge-len, 0.0), 0.2),
            pow(max(edge-dispersion-len, 0.0), 0.2),
            pow(max(edge-dispersion*2.0-len, 0.0), 0.2),
        1)*1.2;
    }
    #endif

    fragColor = col;
}