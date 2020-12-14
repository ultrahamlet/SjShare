float isRedColorRGB( vec3 color )
{
    vec3 wantedColor=  vec3( 1.0, 0.0, .0 );
    float distToColor = distance( color.rgb, wantedColor ) ;
    return distToColor;
}

float isRedColor( vec3 color )
{
    return isRedColorRGB(color);
}


const float threshold = .6;
vec3 onlyRedImage2( vec3 color )
{
    float isRed = isRedColor( color );

    vec3 resColor = vec3(0.);
    if ( isRed  < threshold )
        resColor = color;
    return resColor;
}


vec3 onlyRedImage1( vec3 col )
{
	float maxgb = max( col.g, col.b );
    float k = clamp( (col.r-maxgb)*5.0, 0.0, 1.0 );
    return mix( vec3(0.), col, k);
}


float isDebug()
{
    return .0;
}


float lotsOfRed()
{
    return 1.0;
}

vec3 onlyRedImage( vec3 col )
{
    if (lotsOfRed() > 0.5)
        return onlyRedImage1(col);
	return onlyRedImage2(col);
}


float HorizontalLine( vec2 uv, float size )
{
    uv = uv /  vec2( size, .02);
    vec2 absUV = abs(uv);
    
    return 1.-step( 1., max(absUV.x, absUV.y) );
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec3 origColor = vec3( texture(iChannel0, uv));
    
    
    // get red color from camera :
	vec3 color = onlyRedImage( origColor );
    
    // to help debug without camera :)
    if (iMouse.z > .5 )
    {
        vec2 mouseUV = iMouse.xy / iResolution.xy;
        mouseUV.x = (mouseUV.x);
        
        float m = HorizontalLine( uv - mouseUV, .05);
        const vec3 redColor = vec3(1., .0, .0);
    	color = mix( color, redColor, m );
    }
    
    if ( isDebug()> .5 )
    {
        float m = HorizontalLine( uv - vec2( .1, .1), .05);
        const vec3 redColor = vec3(1., .0, .0);
        color = mix( color, redColor, m );
    }
   fragColor = vec4(color, .1);
}
