import {Component, ViewChild, ElementRef} from '@angular/core';
import {Loading, NavController, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {Geolocation} from 'ionic-native';
import {Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

declare var google;
declare var io;

@Component({
    templateUrl: 'build/pages/home/home.html'    
})
export class HomePage {

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('direction') directionElement: ElementRef;       
    map: any;
    trackLatLng = { 'latitude': 0, 'longitude': 0 };
    previousTrackLatLng = { 'latitude': 0, 'longitude': 0 };
    directionsService: any;
    directionsDisplay: any;
    socketHost = 'http://192.168.0.103:3000'    
    locationGetIo: any;
    markers = [];
    bounds: any;
    mapLoaded = false;

    constructor(private navController: NavController, private navParams: NavParams, private http: Http) {        
        var connect = function (ns) {
            return io.connect(ns, {
               query: 'ns='+ns,
               resource: "socket.io"
            });
        }

        this.locationGetIo = connect(this.socketHost);        
        this.initDirection();
        this.locationGetIo.on('location', (location) => {
            console.log('Location from server: ' + location['latitude'] + ' ' + location['longitude']);
            this.trackLatLng = {'latitude': location.latitude, 'longitude': location.longitude};                        
            this.setDirection();
            this.addMarker();                
        })
    }

    loader: any;

    presentLoadingCustom() {
        this.loader = Loading.create({            
            content: 'Loading map ...'            
        });

        this.loader.onDismiss(() => {
            console.log('Dismissed loading');
        });

        this.navController.present(this.loader);
    }

    dismissLoadingCustom() {
        this.loader.dismiss();
    }

    ionViewDidEnter() {
        //this.presentLoadingCustom();        
        this.loadMap();                                
    }    

    private getJson(response: Response) {
        return response.json();
    }

    checkForError(response: Response): Response {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText);
            error['response'] = response;
            Observable.throw(error);
        }
    }

    testGet() {
        this.get().subscribe(
            result => {
                console.log('Res = ' + result);
                this.trackLatLng = result[0];                
                this.setDirection();
            },
            error => console.log('Error')
        );        
    }

    get(): Observable<any> {
        let myHeaders: Headers = new Headers
        myHeaders.set('Content-type', 'application/json')
        let opt = new RequestOptions({
            headers: myHeaders
        })

        var url = 'https://lit-plains-83504.herokuapp.com/locations';
        return this.http
            .get(url)
            .map(this.checkForError)
            .catch(err => Observable.throw(err))
            .map(this.getJson);
    }        

    initDirection() {
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});        
    }

    setDirection() {            
        var track = new google.maps.LatLng(this.trackLatLng['latitude'], this.trackLatLng['longitude']); 
        var latLng = new google.maps.LatLng(10.768849, 106.632194);               
        var request = {
            origin: track,
            destination: latLng,
            travelMode: 'DRIVING'
        };
        var display = this.directionsDisplay;                
        this.directionsService.route(request, function (response, status) {
            if (status == 'OK') {
                console.log(response);
                display.setDirections(response);
            }
            else {                
                console.log('Something wrong. Maybe the shipper\'s position is unknown    now!');                                    
                //alert('Something wrong. Maybe the shipper\'s position is unknown now!');                                    
            }        
        });
    }

    addMarker() {        
        var track = new google.maps.LatLng(this.trackLatLng['latitude'], this.trackLatLng['longitude']);        
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        let marker = new google.maps.Marker({
            map: this.map,
            title: 'Shipper\'s location',
            animation: google.maps.Animation.BOUNCE,
            position: track
        });
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers.push(marker);
        this.bounds.extend(marker.position);
        this.map.fitBounds(this.bounds);
        this.map.panToBounds(this.bounds); 
    }

    loadMap() {        
        this.bounds = new google.maps.LatLngBounds();
        //Geolocation.getCurrentPosition().then((position) => { 
            var position = {'coords':{'latitude':0,'longitude':0}};
            position.coords = {'latitude': 10.768849, 'longitude': 106.632194}
            var latLng = new google.maps.LatLng(10.768849, 106.632194);
            this.bounds.extend(latLng);                      
            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            this.directionsDisplay.setMap(this.map);
            this.directionsDisplay.setPanel(this.directionElement.nativeElement);

            //this.dismissLoadingCustom();

            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
            let marker = new google.maps.Marker({
                map: this.map,
                icon: iconBase + 'ranger_station.png',
                title: 'Order location',
                position: this.map.getCenter()
            });

            if (this.trackLatLng['latitude'] !== 0 && this.trackLatLng['longitude'] !== 0) {
                this.addMarker();
                this.setDirection();                
            }
        //}
        //);
    };    
}
