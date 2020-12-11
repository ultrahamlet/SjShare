//:0v
#define PI 3.14159265358979
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// A list of usefull distance function to simple primitives, and an example on how to 
// do some interesting boolean operations, repetition and displacement.
//
// More info here: http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
float sdPlane( vec3 p )
{
	return p.z;
}

float sdEllipsoid( in vec3 p, in vec3 r )
{
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

//----------------------------------------------------------------------


vec2 opU( vec2 d1, vec2 d2 )
{
	return (d1.x<d2.x) ? d1 : d2;
}

	vec2 opB( vec2 d1, vec2 d2 )
{
	return vec2(smin(d1.x,d2.x,.2),smin(d1.x,d2.x,.2));
}

//----------------------------------------------------------------------

vec2 map( in vec3 pos )
{
  vec2 res=vec2(sdEllipsoid( pos+vec3(sin(iTime/3.0),1.7*cos(iTime/3.0),0.0), vec3(2.0+cos(iTime)/5.0, 2.0+sin(iTime/2.0)/5.0, .5)/4.0 ), 45.0 );
  res=opB(res,vec2(sdEllipsoid( pos+vec3(1.6*sin(iTime),cos(iTime/2.5),0.0), vec3(2.0+sin(iTime)/5.0, 2.0+cos(iTime/1.2)/5.0, .5)/4.0 ), 45.0 ));    
  res=opB(res,vec2(sdEllipsoid( pos+vec3(.8*cos(iTime/3.0),1.7*sin(iTime/3.0),0.0), vec3(2.0+cos(iTime/3.0)/5.0, 2.0+sin(iTime/5.0)/5.0, .5)/4.0 ), 45.0 ));
  res=opB(res,vec2(sdEllipsoid( pos+vec3(.8*sin(iTime/3.0),.8*cos(iTime/3.0),0.0), vec3(2.0+sin(iTime/2.0)/5.0, 2.0+cos(iTime/2.0)/5.0, .5)/4.0 ), 45.0 ));
  res=opB(res,vec2(sdEllipsoid( pos+vec3(1.6*cos(iTime/2.0),sin(iTime/3.0),0.0), vec3(2.0+cos(iTime/3.0)/5.0, 2.0+sin(iTime/5.0)/5.0, .5)/4.0 ), 45.0 ));
  res=opB(res,vec2(sdEllipsoid( pos+vec3(sin(iTime/2.0),1.7*cos(iTime/3.0),0.0), vec3(2.0+sin(iTime/2.0)/5.0, 2.0+cos(iTime/2.0)/5.0, .5)/4.0 ), 45.0 )); 
  res=opU(res,vec2(sdPlane(pos), 1.5)); 
    return res;
}  
vec2 castRay( in vec3 ro, in vec3 rd )
{
    float tmin = 0.0;
    float tmax =20.0;
    
#if 0
    float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) tmax = min( tmax, tp1 );
    float tp2 = (1.6-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>1.6 ) tmin = max( tmin, tp2 );
                                                 else           tmax = min( tmax, tp2 ); }
#endif
    
	float precis = 0.0002;
    float t = tmin;
    float m = -1.0;
    for( int i=0; i<50; i++ )
    {
	    vec2 res = map( ro+rd*t );
        if( res.x<precis || t>tmax ) break;
        t += res.x;
	    m = res.y;
    }

    if( t>tmax ) m=-1.0;
    return vec2( t, m );
}


float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ )
    {
		float h = map( ro + rd*t ).x;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );

}

vec3 calcNormal( in vec3 pos )
{
	vec3 eps = vec3( 0.001, 0.0, 0.0 );
	vec3 nor = vec3(
	    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
	    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
	    map(pos+eps.yyx).x - map(pos-eps.yyx).x );
	return normalize(nor);
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}


vec3 render( in vec3 ro, in vec3 rd )
{ 
    vec3 col = vec3(0.8, 0.9, 1.0);
    vec2 res = castRay(ro,rd);
    float t = res.x;
	  float m = res.y;
    if( m>0.0)
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos );
        vec3 ref = reflect( rd, nor );
        vec2 ballUv =(pos.xy+vec2(2.5,2.0))*.2;
        // material        
		col = texture(iChannel0, ballUv).rgb,pow(-pos.z/.5, 5.0);	
         if( m>0.1)
         {           
              float f = mod( floor(5.0*pos.y) + floor(5.0*pos.x), 2.0);
            col = 0.4 + 0.1*f*vec3(1.0);
         }

        // lighting        
        float occ = calcAO( pos, nor );
		    vec3  lig = normalize( vec3(5.0*sin(iTime/3.0), 5.0*cos(iTime/3.0), 3.5) );
		    float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
        float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
        float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
        float dom = smoothstep( -0.1, 0.1, ref.y );
        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
		    float spe = pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);
        dif *= softshadow( pos, lig, 0.02, 2.5 );
        dom *= softshadow( pos, ref, 0.02, 2.5 );

		    vec3 brdf = vec3(0.0);
        brdf += .5*dif*vec3(1.00,0.90,0.60);
		    brdf += 1.20*spe*vec3(1.00,0.90,0.60)*dif;
        brdf += 0.30*amb*vec3(0.50,0.70,1.00)*occ;
        brdf += 0.40*dom*vec3(0.50,0.70,1.00)*occ;
        brdf += 0.30*bac*vec3(0.25,0.25,0.25)*occ;
        brdf += 0.40*fre*vec3(1.00,1.00,1.00)*occ;
		brdf += 0.02;
		col = col*brdf;
    	col = mix( col, vec3(0.8,0.9,1.0), 1.0-exp( -0.0005*t*t ) );
    }
    else t /= 15.0;
	col *= exp( -0.015*t*t );

    // lights
        vec3 lv = normalize(vec3(5.0*sin(iTime/3.0), 5.0*cos(iTime/3.0), 3.5)) - ro/3.5;
        float ll = length( lv );
        if( ll<t )
        {
        float dle = clamp( dot( rd, lv/ll), 0.0, 1.0 );
			  dle = (1.0-smoothstep( 0.0, 0.2*(0.7+0.3*.5), acos(dle)*ll ));
        col += dle*6.0*.5*vec3(1.0,1.0,0.0)*dle*exp( -0.1*ll*ll );;
        }
	return vec3( clamp(col,0.0,1.0) );
}  

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = gl_FragCoord.xy/iResolution.xy;
    vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;
    vec2 mo = iMouse.xy/iResolution.xy;
		 
	float time = 15.0 + iTime;

	// camera	
	vec3 ro = vec3(0.0,-6.0+6.0*cos(mo.y*PI),2.0+2.0*cos(mo.y*PI));
	vec3 ta = vec3( 0.0, -0.5, 0.0 );
	// camera-to-world transformation
    mat3 ca = setCamera( ro, ta, 0.0 );
    
    // ray direction
	vec3 rd = ca * normalize( vec3(p.xy,2.0) );

    // render	
    vec3 col = render( ro, rd );

	col = pow( col, vec3(0.4545) );
    fragColor=vec4( col, 1.0 );
}