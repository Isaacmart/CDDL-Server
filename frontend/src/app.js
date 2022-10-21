import React from "react";
import Input from "./input";

export default class App extends React.Component {

   render() {
      return (
         <>
            <div class="labheader">
               <h1>Computational Drug Discovery Laboratory </h1>
            </div>
            <Input />
         </>
      );
   }
}
