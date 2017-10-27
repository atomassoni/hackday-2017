import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

/**
 * Generated class for the DevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'device'
})
@Component({
  selector: 'page-device',
  templateUrl: 'device.html',
})
export class DevicePage {
  device: any;
  connected: boolean;
  newPosition: {
    id: string;
    latitude: number;
    longitude: number;
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public ble: BLE, public zone: NgZone) {
    this.device = this.navParams.get('selectedDevice');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicePage');
    this.connectToDevice();
  }

  ionViewWillLeave() {
    this.disconnectDevice();
  }

  //on disconnect this will conveniently error
  connectToDevice() {
      this.ble.connect(this.device.id).subscribe(connected => {
        console.log(`${this.device.id} successfully connected`);
        //change this value on the UI as soon as it happens by using zone.run
        this.zone.run(() => {
        this.connected = true;
        })
        this.read();
      }, error => {
        console.log(`${this.device.id}  connection error`);
        //change this value on the UI as soon as it happens by using zone.run
        this.zone.run(() => {
        this.connected = false;
        })
      })
  }

  disconnectDevice() {
    this.ble.disconnect(this.device.id).then(success => {
      console.log(`${this.device.id} successfully disconnected`);
    }).catch(error => {
      console.log('device not disconnected!');
    })
  }

  read() {
    this.ble.startNotification(this.device.id, 'FFE0', 'FFE1').subscribe(deviceData=>{
      //you could do this with less code but let's make it obvious what we're doing
      let data = '';
      let dataArray = [];

      this.zone.run(()=>{
        data = this.translateArrayBuffertoString(deviceData);
        dataArray = data.split(',');
        if (dataArray[1]=='la') {
          this.newPosition = {
            id: dataArray[0],
            latitude: parseFloat(dataArray[2]),
            longitude: 0
          }
        } else if (this.newPosition && dataArray[1]=='lo'&& this.newPosition.longitude == 0) {
          this.newPosition.longitude = parseFloat(dataArray[2]);
          //post it to a server, display it on a map, etc. go wild!
          this.zone.run(()=>{
            this.newPosition;
          })
        }


    console.log(`value read from device ${data}`)   
                                              
      })
    })
  }

  translateArrayBuffertoString(arrayBuffer) {
    return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));;
  }
} 
