
<script>
    import {MapElementMixin} from 'vue2-google-maps';

    export default {
        mixins: [MapElementMixin],
        props: {
            route: {
                type: Array,
                twoWay: true
            }
        },
        data: function() {
            return {
                directionsService: null,
                directionsDisplay: null, 
            }
        },
        render: function() { return ''; },

        destroyed: function () {
            if (this.directionsDisplay) {
                this.directionsDisplay.setMap(null);
            }
        },
        deferredReady: function() {
            let directionsService = new google.maps.DirectionsService();
            let directionsDisplay = new google.maps.DirectionsRenderer();
            this.directionsService = directionsService,
            this.directionsDisplay = directionsDisplay, 
            this.getRoute();
        },
        methods: {

            getRoute: function () {
            
                this.service(this.route);
                this.$watch('route', this.service, { deep: true /*this.deepWatch*/  });
                this.directionsDisplay.setMap(this.$map);
            },
            service: function(route) {
                if (route) {

                    let stops = route.slice(1,route.length-1);
                    let waypoints = [];
                    stops.forEach(function(a) {
                        waypoints.push({
                            location: a,
                            stopover: true
                        });
                    })
                    var vm = this;
                    if(route.length > 2) {
                        this.directionsService.route({
                            origin: route[0], // Can be coord or also a search query
                            destination: route[route.length-1], //this.destination,
                            waypoints: waypoints,
                            //optimizeWaypoints: true,
                            travelMode: 'DRIVING'
                        }, function (response, status) {
                            if (status === 'OK') {
                                vm.directionsDisplay.setDirections(response) // draws the polygon to the map
                            } else {
                                console.log('Directions request failed due to ' + status)
                            }
                        });
                    }
                }
            }

        },


    }
</script>