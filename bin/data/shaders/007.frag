//:0v
// /*
// current (transverse mercator) version
// 2020 2/19
#define PI 3.141592653589793238462643383279502884197169399375105820974944592307816406286
// i know more

float sech (float x) {
    return 2.*cosh(x)/(cosh(2.*x)+1.);
}
vec2 inv_f (vec2 z) {
    // inverse transverse mercator
    // thanks wikipedia
    z = vec2(z.y, z.x+iTime*.2)*3.;
    z = vec2(
        atan(sinh(z.x)/cos(z.y)),
        asin(sech(z.x)*sin(z.y))
    )/PI*4.;
    z = vec2(z.x+z.y, z.x-z.y);
    return vec2(fract(z.x), fract(z.y));
}

void mainImage (out vec4 fragColor, in vec2 fragCoord) {
    vec2 screen = (fragCoord-iResolution.xy/2.)/iResolution.y*2.;
    vec2 z = inv_f(screen);
    // vec3 retina = vec3(min(z.x, z.y), z.x, max(z.x, z.y));
    vec3 retina = texture(iChannel0, inv_f(screen)).rgb;
    fragColor = vec4(retina, 1.);
}


// old (fractal) version (scroll down for others)
// made 2019 9/8 I think
// see https://www.shadertoy.com/view/WljGRh
/*


// set it equal to (subdivisions-2)/subdivisions
float shrink = 5.0/7.0;

// typically an integer from 1 to ∞
int subdivisions = 7;

vec3 col(vec2 p) {
    p.x = mod(p.x+1e3, 1.0);
    p.y = mod(p.y+1e3, 1.0);
    float zx = log(abs(p.x*2.0-1.0))/log(shrink);
    float zy = log(abs(p.y*2.0-1.0))/log(shrink);
    
    float t = mod(iTime, 1.0);
    
    float z = min(zx, zy);
    z = z+t;
    
    float x0 = 1.0/2.0-pow(shrink, floor(z))*1.0/2.0;
    float px = (abs(p.x)-x0)*pow(1.0/shrink, floor(z));
    
    float y0 = (1.0/2.0)*(1.0-pow(shrink, floor(z)));
    float py = (abs(p.y)-y0)*pow(1.0/shrink, floor(z));
    
    px = 0.5+(px-0.5)*pow(shrink, t);
    py = 0.5+(py-0.5)*pow(shrink, t);
    
    vec2 p2 = vec2(
        mod(abs(px*float(subdivisions)), 1.0),
        mod(abs(py*float(subdivisions)), 1.0)
    );
    
    return texture(iChannel0, p2).xyz;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    
    
    // Output to screen
    fragColor = vec4(col(uv),1.0);
    

}

/**/












// circle inversion version
// see https://www.shadertoy.com/view/3lXXR8
/*
vec2 invrted(vec2 p, vec2 cc, float cr) {
	float r2 = cr*cr/length(p-cc);
	return cc+r2*vec2(p-cc)/length(p-cc);
}

vec3 col(vec2 p) {
    p.x = mod(p.x+1000.0+iTime*0.3*.0, 1.0);
    p.y = mod(p.y+1000.0+sin(iTime)*0.0, 1.0);
    float th = sin(atan(p.y-0.5, p.x-0.5)*2.0)/2.0+0.5;
    float rd = length(vec2(p.x-0.5, p.y-0.5));
    // th = p.x;
    // rd = p.y;
    return texture(iChannel0, p).xyz;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord-iResolution.xy/2.0)/iResolution.x;
    
    vec2 maus = (iMouse.xy-iResolution.xy/2.0)/iResolution.x;
    
    vec2 p = invrted(
        uv,
        maus,
        length(maus)*length(maus)*12.0
    );
    
    // Output to screen
    fragColor = vec4(col(p),1.0);
    

}
/**/













// old (tunnel) version
// see https://www.shadertoy.com/view/3t2GR1
/*
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float PI = 3.1415926;
    // 535897932384626433832795028841971693993751058209749
    // ima bit rusty i know 370ish digits
	float squish = 1.0;
    float squash = 1.1;
    vec2 center = vec2(iResolution.x/2.0, iResolution.y/2.0);
    vec2 xy = vec2(
        (fragCoord.x-center.x)/squash,
    	(fragCoord.y-center.y)/squish
    );
    
    // ↓ for convenience
    float x = xy.x;
    float y = xy.y;
    
    float zr = iTime+500.0/sqrt(x*x+y*y);
    float zt = mod(3.1415*2.0+1.0*atan(y,x), 3.141*2.0);
    
    // it makes it be all checkerboardy
    float czk1 = 1.0/PI;
    float czk2 = 30.0/PI;
    // zr = floor(zr*czk1)/czk1;
    // zt = floor(zt*czk2)/czk2;
    
    float parx = 0.5 + 0.5*cos(zt*16.0+zr);
    float pary = 0.5 + 0.5*cos(zt*16.0+zr*16.0);
    
    float t1 = 2.0/3.0;
    float t2 = 4.0/9.0;
    parx = mod(zr*1.0+zt, PI*t1)/PI/t1;
    pary = mod(zt+zt, PI*t2)/PI/t2;
    
    // a differet textrue thingy
    // parx = mod(zt*12.0+zr*6.0, PI*2.0)/PI/2.0;
    // pary = mod(zt*6.0+zr, PI*2.0)/PI/2.0;
    
    
    // ugly black fog at the horizon. yuck.
    // float fog = 5.0;
    
    // if (abs(y)<fog) {
    //     parx = parx*sqrt(y/fog);
    //     pary = pary*sqrt(y/fog);
    // }
    
    // vec3 col = vec3(min(parx, pary), parx, max(parx, pary));
	vec3 col = texture(iChannel0, vec2(parx, pary)).xyz;
    
    // Output to screen
    fragColor = vec4(col,1.0);
}
/**/