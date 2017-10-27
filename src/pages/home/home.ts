import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  deviceList: Array<{}>;
  constructor(public navCtrl: NavController, public ble: BLE, public zone: NgZone) {
    this.deviceList = [];
  }

  scan() {
    this.deviceList = [];
    
    this.ble.startScan([]).subscribe(device=>{
      console.log(`found a device! ${JSON.stringify(device)}`);
      this.zone.run(()=>{
        this.deviceList.push(device);
        
      })
    },error=>{
      console.log(`ble scan error! ${JSON.stringify(error)}`);
    })
    this.stopScan();
  }

  stopScan() {
    setTimeout(()=>{
      this.ble.stopScan();
    },5000)
  }

  goToDevice(device) {
    this.navCtrl.push('device', {
      selectedDevice: device
    })
  }
}
