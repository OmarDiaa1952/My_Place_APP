import { Modal } from "./UI/Modal";
import { Map } from "./UI/Map";
import {
  getAddressFromCoords,
  getCoordsFromAddress,
} from "../../src/Utility/Location";

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector("form");
    const locationUserBtn = document.getElementById("locate-btn");
    this.shareBtn = document.getElementById("share-btn");

    locationUserBtn.addEventListener(
      "click",
      this.locateUserHandler.bind(this)
    );
    this.shareBtn.addEventListener("click", this.sharePlaceHandler.bind(this));
    addressForm.addEventListener("submit", this.findAddressHandler.bind(this));
  }
  //Create a link of address selected
  sharePlaceHandler() {
    const sharedLinkInputElement = document.getElementById("share-link");
    if (!navigator.clipboard) {
      sharedLinkInputElement.select();
      return;
    }
    navigator.clipboard
      .writeText(sharedLinkInputElement.value)
      .then(() => {
        alert("Copied into Clipboard");
      })
      .catch((err) => {
        console.log(err);
        sharedLinkInputElement.select();
      });
  }
  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
    this.shareBtn.disabled = false;
    const sharedLinkInputElement = document.getElementById("share-link");
    sharedLinkInputElement.value = `${
      location.origin
    }/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
      coordinates.lng
    }`;
  }
  locateUserHandler() {
    if (!navigator.geolocation) {
      alert(
        "Location feature is not available in your browser - please use a more modern browser or manually enter an address."
      );
      return;
    }
    //we pass to Modal two parameter : 1/object 2/ message to do when fails
    const modal = new Modal(
      "loading-modal-content",
      "loading location - please wait!"
    );
    modal.show();
    navigator.geolocation.getCurrentPosition(
      //we make this function async because we must wait till the location is fetched first
      async (successResult) => {
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude,
        };
        const address = await getAddressFromCoords(coordinates);
        modal.hide();
        this.selectPlace(coordinates, address);
      },
      (error) => {
        modal.hide();
        alert(
          "Could not locate you unfortunately. Please enter an address manually!"
        );
      }
    );
  }
  async findAddressHandler(event) {
    event.preventDefault(); //to prevent the form from submitting
    const address = event.target.querySelector("input").value; //this is where we will type our address
    if (!address || address.trim().length === 0) {
      alert("Invalid address entered - please try again!");
      return;
    }
    const modal = new Modal(
      "loading-modal-content",
      "Loading location - please wait!"
    );
    modal.show();
    try {
      const coordinates = await getCoordsFromAddress(address);
      this.selectPlace(coordinates, address);
    } catch (err) {
      alert(err.message);
    }
    modal.hide();
  }
}

const placeFinder = new PlaceFinder();
