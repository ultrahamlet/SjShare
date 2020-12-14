void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec3 origColor = vec3( texture(iChannel0, uv));

    vec2 pix = 1.0 / iResolution.xy;
    
    /*
     float lastVal = 
        	texture(iChannel0, uv - vec2(0.0, pix.y)).r + 
        	texture(iChannel0, uv - vec2(0.0, pix.y*2.0)).r +
        	texture(iChannel0, uv - vec2(pix.x, pix.y)).r +
        	texture(iChannel0, uv - vec2(-pix.x, pix.y)).r;
*/    
/*
    vec3 fireColor = 
        	texture(iChannel1, uv - vec2(0.0, pix.y)).rgb + 
        	texture(iChannel1, uv - vec2(0.0, pix.y*2.0)).rgb +
        	texture(iChannel1, uv - vec2(pix.x, pix.y)).rgb +
        	texture(iChannel1, uv - vec2(-pix.x, pix.y)).rgb;
	fireColor *= 0.248;  // cold phase
*/
    vec3 fireColor = 
        	texture(iChannel1, uv - vec2(0.0, pix.y)).rgb + 
        	texture(iChannel1, uv - vec2(0.0, pix.y*2.0)).rgb +
        	texture(iChannel1, uv - vec2(0.0, pix.y*3.0)).rgb +
        	texture(iChannel1, uv - vec2(2.*pix.x, pix.y)).rgb +
        	texture(iChannel1, uv - vec2(-2.*pix.x, pix.y)).rgb +
        	texture(iChannel1, uv - vec2(pix.x, pix.y)).rgb +
        	texture(iChannel1, uv - vec2(-pix.x, pix.y)).rgb;
	fireColor *= 0.14;  // cold phase

    // Output to screen
    fragColor = vec4(fireColor + origColor,1.0);
}