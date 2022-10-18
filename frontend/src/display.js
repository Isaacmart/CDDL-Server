import React from "react";

export default class Display extends React.Component {
   
   constructor(props) {
      super(props);
      this.state= {jsmol: ''}
   }

   componentDidMount() {
      jmolInitialize('jmol-14.32.63/jsmol');
      var Info = getInfo(NaN);
      this.setState({jsmol: Jmol.getApplet("myJmol", Info)});
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevProps.file !== this.props.file){
         document.getElementById("myJmol_appletinfotablediv").remove();

         var pdb = "PDB/" + this.props.file + ".pdb";
         var result = "results/" + this.props.file + "_top10.pdb";
         var detail = "details/" + this.props.file + "_top3.pdb"; 

         var rsc = "background black; load " + pdb + 
                     "; cartoon only; color structure; load APPEND " + detail + 
                     "; frame *; display 1.1,2.1; select 2.1; spacefill only; spacefill 100; color relativeTemperature; set spinY 5; spin";
         var Info = getInfo(rsc);
         var myJmol = Jmol.getAppletHtml("myJmol", Info);
         document.getElementById("frame1").innerHTML = myJmol;

         var dsc = "background black; load " + pdb + 
                     "; cartoon only; color structure; load APPEND " + result + 
                     "; frame *; display 1.1,2.1; select 2.1; cpk only; color relativeTemperature; set spinY 5; spin";
         var Info2 = getInfo(dsc);
         var myJmol2 = Jmol.getAppletHtml("myJmol2", Info2);
         document.getElementById("frame2").innerHTML = myJmol2;
      }
   }

    render() {
       return (
          <>
            <div id="display" ref={el => (this.instance = el)}> 
               <div id="frame1" />
               <div id="frame2"/>
            </div>
          </>
       );
    }
 }


 function getInfo(script) {

   var Info = {
      color: "#FFFFFF", 
      height: 500, 
      width: 500, 
      use: "HTML5", 
      script: script, 
      j2sPath: "jmol-14.32.63/jsmol/j2s", 
      jarFile: "JmolApplet0.jar",
      serverURL: "http://localhost:3000/jmol-14.32.63/jsmol/php/jsmol.php"
   };

   return Info;
 }