import React from "react";

export default class Display extends React.Component {
   
   constructor(props) {
      super(props);
      this.state= {jsmol: ''}
   }

   componentDidMount() {
      jmolInitialize('jmol-14.32.63/jsmol');
      var Info = {
         color: "#FFFFFF",
         height: 500,
         width: 500,
         use: "HTML5",
         j2sPath: "jmol-14.32.63/jsmol/j2s",
       };
      this.setState({jsmol: Jmol.getApplet("myJmol", Info)});
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevProps.file !== this.props.file){
         document.getElementById("myJmol_appletinfotablediv").remove();
         var pdb = "PDB/" + this.props.file + ".pdb";
         var result = "results/" + this.props.file + "_top10.pdb";
         var detail = "details/" + this.props.file + "_top3.pdb"; 
         var rsc = "set appendNew false; load " + pdb + "; load APPEND " + result;
         var Info = {
            color: "#FFFFFF",
            height: 500,
            width: 500,
            use: "HTML5",
            script: rsc,
            j2sPath: "jmol-14.32.63/jsmol/j2s",
            jarFile: "JmolApplet0.jar",
            serverURL: "http://localhost:3000/jmol-14.32.63/jsmol/php/jsmol.php"
          };
         var myJmol = Jmol.getAppletHtml("myJmol", Info);
         document.getElementById("frame1").innerHTML = myJmol;

         var dsc = "set appendNew false; load " + pdb + "; load APPEND " + detail;
         var Info2 = {
            color: "#FFFFFF", 
            height: 500, 
            width: 500, 
            use: "HTML5", 
            script: dsc, 
            j2sPath: "jmol-14.32.63/jsmol/j2s", 
            jarFile: "JmolApplet0.jar",
            serverURL: "http://localhost:3000/jmol-14.32.63/jsmol/php/jsmol.php"
         };
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