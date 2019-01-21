import React, { Component } from "react";
import "./App.css";

import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

import * as ml5 from "ml5";

class App extends Component {
  constructor() {
    super();
    this.state = {
      image: "",
      predictions: []
    };
  }

  setPredictions = pred => {
    this.setState({ predictions: pred });
  };

  classifyImg = () => {
    const img_classifier_model = ml5.imageClassifier("MobileNet", modelLoaded);
    function modelLoaded() {
      console.log("Loaded Model");
    }
    const predict_image = document.getElementById("image");
    img_classifier_model
      .predict(predict_image, 3, function(err, results) {
        return results;
      })
      .then(results => {
        this.setPredictions(results);
      });
  };

  onTakePhoto(dataUri) {
    this.setState({
      image: dataUri
    });
    this.classifyImg();
  }

  render() {
    let prediction_result = <div/>;

    if (this.state.predictions.length > 0) {
      prediction_result = this.state.predictions.map((pred, i) => {
        let { className, probability } = pred;

        probability = Math.floor(probability * 10000) / 100 + "%";
        return (
          <div key={i + ""}>
            {i + 1}. Found {className} with {probability}{"% Probability"}
          </div>
        );
      });
    }
    return (
      <div className="App">
        <h2>Long time no React</h2>
        <div className="Camera">
          <Camera
            onTakePhoto={dataUri => {
              this.onTakePhoto(dataUri);
            }}
          />
          <img src={this.state.image} alt="Predict" id="image" />
        </div>
        {prediction_result}
      </div>
    );
  }
}

export default App;