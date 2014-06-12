exports.snip = function (text,length){ 
    if(text.length < length) return text; 
    var Foremost = text.substr(0,length); 
    var re = /<(\/?) (BODY|SCRIPT|P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|TABLE|TR|TD|TH|INPUT|SELECT|TEXTAREA|OBJECT |A|UL|OL|LI|BASE|META|LINK|HR|BR|PARAM|IMG|AREA|INPUT|SPAN)[^>]*(>?)/ig; 

    var Singlable = /BASE|META|LINK|HR|BR|PARAM|IMG|AREA|INPUT/i 
    var Stack = new Array(), posStack = new Array(); 
    while(true){ 
        var newone = re.exec(Foremost); 
        if(newone == null) break; 

        if(newone[1] == ""){ 
            var Elem = newone[2]; 
            if(Elem.match(Singlable) && newone[3]!= ""){ 
                continue; 
            } 
            Stack.push(newone[2].toUpperCase()); 
            posStack.push(newone.index); 

            if(newone[3] == "") break; 
        }else{ 
            var StackTop = Stack[Stack.length-1]; 
            var End = newone[2].toUpperCase(); 
            if(StackTop == End){ 
                Stack.pop(); 
                posStack.pop(); 
                if(newone[3] == ""){ 
                    Foremost = Foremost+">"; 
                } 
            } 

        }; 
    } 
    var cutpos = posStack.shift(); 
    Foremost = Foremost.substring(0,cutpos); 

    return Foremost; 
} 