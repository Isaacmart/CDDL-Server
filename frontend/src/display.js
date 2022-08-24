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
         height: 300,
         width: 300,
         use: "HTML5",
         j2sPath: "jmol-14.32.63/jsmol/j2s",
       };
      this.setState({jsmol: Jmol.getApplet("myJmol", Info)});
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevProps.file !== this.props.file){
         var Info = {
            color: "#FFFFFF",
            height: 300,
            width: 300,
            use: "HTML5",
            script: `load results/${this.props.file}`,
            j2sPath: "jmol-14.32.63/jsmol/j2s",
            jarFile: "JmolApplet0.jar",
            serverURL: "http://localhost:3000/jmol-14.32.63/jsmol/php/jsmol.php"
          };
         document.getElementById("myJmol_appletinfotablediv").innerHTML = Jmol.getAppletHtml("myJmol", Info);
      }
   }

    render() {
       return (
          <>
            <div id="display" ref={el => (this.instance = el)} />
            <p> {this.props.file} </p>
          </>
       );
    }
 }