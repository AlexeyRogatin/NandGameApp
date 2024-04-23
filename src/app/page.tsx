import Link from "next/link";
import React from "react";
import BreakingParagraph from "./components/BreakingParagraph";

export default function Home() {
  const asciiArt = `
                      1                                   
                     ,8B^                                 
                       ?@i                                
                       Cp^                                
              '(jr|'lb|                                   
             %$$$$&;@$$z                   .'';u&$$$$@j   
         CB>o$$$$%($$$$$*       "1UQq&$$Bdr{]!uk$d[..nat  
       h$o ^M$$$$$$$$$$$$ Z$8wY?.       .+w$oc' ln@$$$$j  
       }$B  Y$$$$$$$$$$$Z   @$$m     Q8$Y,  ~M$$$$$$$$$j  
 'M8nj-  ou 1|U$$$$$$&n'  1%%j 'xa$0}. .rM$$$$$$$$$$$$$+  
 '#&$U^      uB!''I[)    ^'!#$Mr  .Iw$$$$$$$$$$$$$&X      
 'Mu ^t$@bC>  ^J$O~.  '0&$jl   {k$$$$$$$$$$$$$M_'   "m%j  
 'Mu       .I|YJCJCJJJ_   In$$$$$$$$$$$$$%JI   ')#$$$$$j  
 '#u                  .*$$$$$$$$$$$$$$/     z$$$$$$$$$$j  
 'Mu                  W$$$$$$$$$$Z?    +Z$$$$$$$$$$$$$WI  
 'Mu                  W$$$$$8m^   ^]&$$$$$$$$$$$$$b_  ^^  
 'Mu                  W$8i'   'w%$$$$$$$$$$$$$n,  .O%$$j  
 '#u                      1w$$$$$$$$$$$$$hj'  )q$$$$$$$j  
 'Mu                  ]$$$$$$$$$$$$$@b^  ^{@$$$$$$$$$$$j  
 'Mu                  W$$$$$$$$$$t;  lwB$$$$$$$$$$$$B|:   
 'Mu                  W$$$$$p1   [h$$$$$$$$$$$$$d1        
 '#u                  W$w'  .QB$$$$$$$$$$$$$m'            
 'Mu                    _L@$$$$$$$$$$$$%f^                
 '*c                  W$$$$$$$$$$$@bi                     
  .kM"                W$$$$$$$$z;                         
    'uBWj['           W$$$bt                              
          ,uoW&8&8&8&&#,                                  
  `

  return (
    <div className="flex justify-around content-center h-full flex-wrap">
      <div className="flex flex-col justify-between" >
        <h1>Compute the world</h1>
        <div>
          <p>This is an educational site, where you will get the knowledge of how computer works from basic physical elements.</p>
          <p>If you are ready, then press the 'Lets start' button.</p>
        </div>
        <div className="flex flex-col gap-30">
          <Link href="./levels" className="bordered">Lets start</Link>
          <Link href="./authorization" className="bordered">Authorization</Link>
        </div>
      </div>
      <BreakingParagraph>
        {asciiArt}
      </BreakingParagraph>
    </div>
  );
}
