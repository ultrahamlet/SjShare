//
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv =fragCoord/iResolution.xy;
    //uv.y = 1.0 - uv.y;
    vec4 lineCol = vec4(1.0,0.0,1.0,1.0);
    vec4 white = vec4(1.0,1.0,1.0,1.0);
    vec4 blk = vec4(0.0,0.0,0.0,0.0);
    vec4 red = vec4(1.0,0.0,0.0,1.0);
    //lineCol = ((uv.x > 0.8) || (uv.y > 0.8))? blk:lineCol;
    float adx = 0.0;
    float sbx = 0.0;
    float ady = 0.0;
    float sby = 0.0;
    float alias = 0.15;
    //
    vec4 col = texture(iChannel1,uv);
    vec4 col1 = blk;
    float addx = 1.0/1280.0;
    float addy = 1.0/960.0;
    int lp = 0;
    vec2 uv2;
    vec4 val;
    for(int i = 1; i < 5; i++){
        
        if(col == white) break; 
        lp = i;
        adx += addx;
        uv2 = uv + vec2(adx,0.0);  
        val = texture(iChannel1,uv2);
        if(white == val) break;
        //
        sbx -= addx;  
        uv2 = uv + vec2(sbx,0.0);
        val = texture(iChannel1,uv2);
        if(white == val) break;
        //
        sby += addy;
        uv2 = uv + vec2(0.0,ady);
        val = texture(iChannel1,uv2);
        if(white == val) break;
        //
        sby -= addy;
        uv2 = uv + vec2(0.0,sby);
        val = texture(iChannel1,uv2);
        if(white == val) break;
        //
        uv2 = uv + vec2(adx,ady);
        val = texture(iChannel1,uv2);
        if(white == val) break;
        //
        uv2 = uv + vec2(adx,sby);
        val = texture(iChannel1,uv2);
        if(white == val) break;
        //
        uv2 = uv + vec2(sbx,ady);
        val = texture(iChannel1,uv2);
        if(white == val) break;
        //
        uv2 = uv + vec2(sbx,sby);
        val = texture(iChannel1,uv2);
        if(white == val) break;
       
    }
    float cv = (lp < 4) ? 1.0 - lp*alias:0.0;
    col1 = col1 + vec4(cv, cv, cv, 1.0);

    fragColor = col1;
}