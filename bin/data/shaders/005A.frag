float lag_control = 0.125;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    
    
    // lower left
    if (uv.x<0.5 && uv.y<0.5) {
	    fragColor = texture(iChannel0, uv*32.0);
    }

    // lower right
    if (uv.x>0.5 && uv.y<0.5) {
         fragColor = mix(texture(iChannel1, uv),texture(iChannel1, vec2(uv.x, uv.y+0.5)),lag_control);
    }

    // upper right
    if (uv.x>0.5 && uv.y>0.5) {
        // fragColor = vec4(0.0,0.0,1.0,1.0);
        fragColor = mix(texture(iChannel1, uv),texture(iChannel1, vec2(uv.x-0.5, uv.y)),lag_control);
    }

    // upper left
    if (uv.x<0.5 && uv.y>0.5) {
        fragColor = mix(texture(iChannel1, uv),texture(iChannel1, vec2(uv.x, uv.y-0.5)),lag_control);
        // fragColor = vec4(0.0,1.0,0.0,1.0);
    }
    
    
}