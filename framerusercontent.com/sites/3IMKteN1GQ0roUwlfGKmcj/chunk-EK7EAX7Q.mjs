import{f as e}from"./chunk-ENK4YSX5.mjs";e();function n(t,a){return{bodyClassName:"framer-body-TzHJ55tTK",breakpoints:[{hash:"a14hs2",mediaQuery:"(min-width: 2560px)"},{hash:"1xqwykl",mediaQuery:"(min-width: 1440px) and (max-width: 2559px)"},{hash:"nm8z1z",mediaQuery:"(min-width: 1200px) and (max-width: 1439px)"},{hash:"157mpnp",mediaQuery:"(min-width: 810px) and (max-width: 1199px)"},{hash:"1b3mnym",mediaQuery:"(max-width: 809px)"}],customHTMLBodyEnd:`<script>
window.addEventListener("load", function() {
var animate = document.querySelector(".framer-1qikn9a");
var video = animate.querySelector("video");
var iteration = 0;
var myInterval;
var doneTheStuff;


function KnowReactProps(data){
    let id = null;
for(let i = 0, keys = Object.keys(data); i < keys.length; i++)
{
  if ((id = keys[i].match(/^__reactProps[^$]*(\\$.+)$/)))
  {
    id = id[1];
    break;
  }
}
id = "__reactProps" + id;
return id;
}

var mutationObserver = new MutationObserver(entries => {
    for (let i = 0; i < entries.length; i++) {
	var element = entries[i];
if(element.target.style.opacity === '1'){
    iteration = iteration + 1;
    if(even_or_odd(iteration) === 'Odd'){
        console.log('opacity 1');
        video.play();
    }
}else if(element.target.style.opacity === '0'){
    console.log('opacity 0');
    video.load();
    video.pause();
}}})

mutationObserver.observe(animate, {
    attributeFilter: ["style"]
})

var animateSec = document.querySelector(".framer-rkdhw1-container");
var iterationSec = 0;
var mutationObserverSec = new MutationObserver(entriesSec => {
    for (let i = 0; i < entriesSec.length; i++) {
		var elementSec = entriesSec[i];
        console.log(elementSec.target.style.opacity);
		if(+elementSec.target.style.opacity > 0){
			iterationSec = iterationSec + 1;
			if(even_or_odd(iterationSec) === 'Odd'){console.log('opacity 1');


var id = KnowReactProps(document.getElementsByName('Tab 1')[0]);
console.log(id);
console.log("there");
console.log(document.getElementsByName('Tab 1')[0][id]);
document.getElementsByName('Tab 1')[0][id].children.props.tap();
break;}    
		} 
    if (!doneTheStuff) {
        myInterval = setInterval(myTimer, 200);
        doneTheStuff = true;
    }
    function myTimer() {
        if(+elementSec.target.style.opacity == 0){
            
            var id = KnowReactProps(document.getElementsByName('Tab 2')[0]);
            console.log(document.getElementsByName('Tab 2')[0][id]);
        document.getElementsByName('Tab 2')[0][id].children.props.tap();
        }
    }
    }
})
mutationObserverSec.observe(animateSec, {
    attributeFilter: ["style"]
})


function even_or_odd(number) {
    return number % 2 === 0 ? "Odd" : "Even"
}
})

<\/script>`,description:"Here you can find all the application updates for Blitzit, both latest and historic, in one single feed. ",elements:{},framerSearch:{index:!0},title:"Blitzit Changelog",viewport:"width=device-width"}}var i=1,r={exports:{metadataVersion:{type:"variable",annotations:{framerContractVersion:"1"}},default:{type:"function",annotations:{framerContractVersion:"1"}},__FramerMetadata__:{type:"variable"}}};export{n as a,i as b,r as c};
//# sourceMappingURL=chunk-EK7EAX7Q.mjs.map
