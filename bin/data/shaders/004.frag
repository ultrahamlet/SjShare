//:0ab,1bb,0b,0va,1v

#define DEBUG_MODE 1


float isDebug()
{
    return .0;
}


float lotsOfRed()
{
    return 1.0;
}
vec3 fireGrad(float x)
{
    vec3 a = vec3(0.0,0.0,0.0);
    vec3 b = vec3(1.0,0.0,0.0);
    vec3 c = vec3(1.0,1.0,0.0);
    vec3 d = vec3(1.0,1.0,1.0);
    vec3 col;
    col = mix(a,b,smoothstep(0.0,0.6,x));
    col = mix(col,c,smoothstep(0.6,0.9,x));
    col = mix(col,d,smoothstep(0.9,1.0,x));
    
    return col;
}




// procedural noise from IQ
vec2 hash( vec2 p )
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			 dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
	const float K1 = 0.366025404; // (sqrt(3)-1)/2;
	const float K2 = 0.211324865; // (3-sqrt(3))/6;
	
	vec2 i = floor( p + (p.x+p.y)*K1 );
	
	vec2 a = p - i + (i.x+i.y)*K2;
	vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
	vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
	
	vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	
	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
	
	return dot( n, vec3(70.0) );
}

float fbm(vec2 uv)
{
	float f;
	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
	f  = 0.5000*noise( uv ); uv = m*uv;
	f += 0.2500*noise( uv ); uv = m*uv;
	f += 0.1250*noise( uv ); uv = m*uv;
	f += 0.0625*noise( uv ); uv = m*uv;
	f = 0.5 + 0.5*f;
	return f;
}

vec3 greyCamera(vec2 uv)
{
    // Use a grey camera as the background :
    float grey = dot(vec3(texture(iChannel1, uv)), vec3(0.299, 0.587, 0.114) );

    vec3 col;
     // board + vignetting
    {
        col = 0.6*vec3(0.4,0.6,0.7)*(1.0-0.4*length( 2.*(uv-.5) ));
        col *= 1.0 - 0.1*smoothstep( 0.0,1.0,sin(uv.x*320.0)*sin(uv.y*320.0))*(1.0 - smoothstep( 1.0, 1.01, abs(uv.x) ) );
    }
    return col + vec3(grey * .5);
}


vec4 shapeToFlame(vec2 uv, float n, float c )
{
    float c1 = n * c * (1.5-pow(1.5*uv.y,.9));
//	float c1 = n * c * (1.5-pow(2.50*uv.y,4.));
	c1=clamp(c1,0.,1.);

    float boostRed = 1.6;
	vec4 col = vec4(boostRed*c1, boostRed*c1*c1*c1, c1*c1*c1*c1*c1*c1,c1);
    
#ifdef TRY_SMOKE
    float blackAdded = 1.- distance( c1, 0.3 );
    blackAdded = clamp( blackAdded, 0.,1.);
    blackAdded = pow( blackAdded, 20.0);
    
    vec4 blackCol = vec4(0., 0.,0.,1.);
    col = mix ( col, blackCol, blackAdded-noise(uv+vec2(0, iTime))*0.5);
#endif // TRY_SMOKE    
    return col;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    //vec3 origColor = vec3( texture(iChannel0, uv));
    float strength = floor(uv.x+1.);
	float T3 = max(3.,1.25*strength)*iTime;

    float n= fbm( uv * strength *5. - vec2(0,T3) );
    
    float flameShape = vec3( texture(iChannel0, uv)).r;
    //flameShape = 10.0;
    float maxVal = 1.5;
    flameShape = clamp(flameShape, 0.,maxVal);
    
    if ( isDebug()> .5 )
    {
        if ( uv.x > 0.9 )
            flameShape = ( 1.-uv.y) * maxVal;
    }
    
    flameShape = pow(flameShape/maxVal, 0.8)*maxVal;
    
    
    if ( isDebug()> .5 )
    {
        if ( uv.x > 0.8 && uv.x < 0.9 )
            flameShape = ( 1.-uv.y) * maxVal;
    }    
    vec4 colFire = shapeToFlame( uv, n, flameShape );
    
    
    
    //vec3 color = fireGrad(n*origColor*2.2);
    //color = col;
    // Output to screen
    
    vec3 col;// = colFire;
    
    //col += greyCamera(uv);
    col += texture(iChannel1, uv).rgb;
    col = mix( texture(iChannel1, uv).rgb, colFire.rgb, colFire.a);
    
	//if ( uv.x > 0.9 )
      //  col = vec3(1.-uv.y);


    
    //col = vec3(n);
    //col = vec3(flameShape);
    
    // for test :
    //col = vec3( texture(iChannel2, uv));
    
    fragColor = vec4(col,1.0);
}