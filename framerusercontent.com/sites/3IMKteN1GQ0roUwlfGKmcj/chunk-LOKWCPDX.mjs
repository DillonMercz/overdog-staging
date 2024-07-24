import{a as e}from"./chunk-EVAMH3AX.mjs";import{f as a}from"./chunk-ENK4YSX5.mjs";a();function o(n,t){return{bodyClassName:"framer-body-AIu6NjN6t",breakpoints:[{hash:"1urlk82",mediaQuery:"(min-width: 1200px)"},{hash:"1jnmc2o",mediaQuery:"(min-width: 810px) and (max-width: 1199px)"},{hash:"ba39o",mediaQuery:"(max-width: 809px)"}],customHTMLHeadEnd:`<script type="text/javascript">
  window.addEventListener("load", function(){
    console.log("load event");
    replayHeroVideo();
    // tabsVideoPlay();
  });

  function KnowReactProps(data) {
    let id = null;
    for (let i = 0, keys = Object.keys(data); i < keys.length; i++) {
      if ((id = keys[i].match(/^__reactProps[^$]*(\\$.+)$/))) {
        id = id[1];
        break;
      }
    }
    return "__reactProps" + id;
  }

  function even_or_odd(number) {
    return number % 2 === 0 ? "Odd" : "Even";
  }

  const replayHeroVideo = () => {
    var animate = document.querySelector(".framer-1qikn9a");
    var video = animate?.querySelector("video");

    console.log({ video });

    if (!video) return;

    var iteration = 0;

    var mutationObserver = new MutationObserver((entries) => {
      for (let i = 0; i < entries.length; i++) {
        var element = entries[i];
        if (element.target.style.opacity === "1") {
          iteration = iteration + 1;
          if (even_or_odd(iteration) === "Odd") {
            console.log("opacity 1");
            video.play();
          }
        } else if (element.target.style.opacity === "0") {
          console.log("opacity 0");
          video.load();
          video.pause();
        }
      }
    });

    mutationObserver.observe(animate, {
      attributeFilter: ["style"],
    });
  };

  const tabsVideoPlay = () => {
    var doneTheStuff;
    var animateSec = document.querySelector(".framer-rkdhw1-container");
    console.log({ animateSec });

    if (!animateSec) return;

    var iterationSec = 0;
    var mutationObserverSec = new MutationObserver((entriesSec) => {
      for (let i = 0; i < entriesSec.length; i++) {
        var elementSec = entriesSec[i];
        if (+elementSec.target.style.opacity > 0) {
          iterationSec = iterationSec + 1;
          if (even_or_odd(iterationSec) === "Odd") {
            var id = KnowReactProps(document.getElementsByName("Tab 1")[0]);
            const tab = document.getElementsByName("Tab 1")[0][id];
            const tabVideo = tab.querySelector("video");
            console.log({tabVideo})
            if (tabVideo) {
              tabVideo.load();
              tabVideo.play();
            }
            break;
          }
        }
        if (!doneTheStuff) {
          setInterval(() => {
            if (+elementSec.target.style.opacity == 0) {
              var id = KnowReactProps(document.getElementsByName("Tab 2")[0]);
              const tab = document.getElementsByName("Tab 2")[0][id];
              const tabVideo = tab.querySelector("video");
              console.log({tabVideo})
              if (tabVideo) {
                tabVideo.load();
                tabVideo.play();
              }
            }
          }, 200);
          doneTheStuff = true;
        }
      }
    });
    mutationObserverSec.observe(animateSec, {
      attributeFilter: ["style"],
    });
  };
<\/script>
`,description:e(n,t).description,elements:{A4Z0zJ0h2:"pricing",GdL57HJTW:"pill-screen",V1u4z1zVo:"features",xVcmavQ2I:"roadmap"},robots:"max-image-preview:large",title:e(n,t).title||"Home",viewport:"width=device-width"}}var r=1,d={exports:{default:{type:"function",annotations:{framerContractVersion:"1"}},metadataVersion:{type:"variable",annotations:{framerContractVersion:"1"}},__FramerMetadata__:{type:"variable"}}};export{o as a,r as b,d as c};
//# sourceMappingURL=chunk-LOKWCPDX.mjs.map
