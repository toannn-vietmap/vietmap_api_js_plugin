
A package for using the [VietMap APIs](https://maps.vietmap.vn/docs/map-api/overview/) in JS/TS.

# Vietmap API plugin

[<img src="https://bizweb.dktcdn.net/100/415/690/themes/804206/assets/logo.png?1689561872933" height="40"/> </p>](https://vietmap.vn/maps-api)

Contact [vietmap.vn](https://bit.ly/vietmap-api) to register a valid key.

## Installation

With npm:

```bash
npm install --save @vietmap/vietmap-api
```

With Yarn:

```bash
yarn add @vietmap/vietmap-api
```

With pnpm:

```bash
pnpm add @vietmap/vietmap-api
```

## Usage

### Import VietmapApi:

```typescript
import { VietmapApi } from '@vietmap/vietmap-api';
```

Create an instance using apiKey:

```typescript
const VietmapApi = new VietmapApi({ apiKey: VIETMAP_API_KEY })
```

## Examples

### Reverse 
Updating Reverse 3.0 API is a valuable resource for developers who want to incorporate location search features into their applications while achieving optimal performance. With its intelligent search algorithms and techniques, this latest version can swiftly deliver precise search results for users. This API is a powerful tool that can help enhance the user experience of location-based applications.

```typescript
const reverseResponse = await vietmapApi.reverse({
  latitude: 35.72379,
  longitude: 51.33417,
});
```

### AutoCompleteSearch
Updating Autocomplete 3.0 API is a valuable resource that allows developers to integrate autocomplete functionality into their applications. This API is designed to help users quickly find and select items from a large set of options by suggesting potential matches as they type.

The API is built on a machine-learning model that analyzes user input and suggests potential matches based on the context of the search. This model can be updated in real-time, allowing the API to continuously improve its suggestions as more data becomes available.


```typescript
const autoCompleteSearchResponseList = await vietmapApi.autoCompleteSearch(
  new SearchRequest({ 
    text: 'Vietmap',
    apikey: envVariables.VIETMAP_API_KEY, 
  }),
);
```

### Search - Geocode
Updating Geocode 3.0 API is a powerful tool for developers to integrate location search functionality into their applications with optimized performance. Additionally, this latest version utilizes intelligent search algorithms and methods to provide accurate and speedy search results for users.
```typescript

const searchResponseList = await vietmapApi.search(
  new SearchRequest({ 
      text: 'Vietmap',
      apikey: envVariables.VIETMAP_API_KEY, 
    }),
);
```
### Place
The Place API service endpoint provides detailed information about the Place found by its identifier (refId).
```tsx
  const res = await vietmapApi.place(
      new PlaceRequest({
        refId: 'vm:ADDRESS:8D92EB120DDE9996',
        apikey
      }),
    );
```
### Routing
A Route Maps API is a feature provided by VIETMAP that allows developers to calculate and display the optimal route between two or more locations on a map. With a Route Maps API, developers can specify the start and end points of a journey, along with any additional constraints such as preferred mode of transportation, and retrieve a detailed route that can be displayed on a map. The API may also provide information such as the total distance, estimated travel time, and turn-by-turn directions. Developers can use Route Maps APIs to create applications that help with navigation, transportation planning, and logistics management.

The `optimize` param is used to enable TSP mode (Traveling Salesman Problem), you can view more about TSP [here](https://maps.vietmap.vn/docs/map-api/tsp/). For the normal case, please do not enable this param.
```typescript
    const res = await vietmapApi.route(
      [[10.79628438955497,106.70592293472612], [10.801891047584164,106.70660958023404]],
      new RouteRequest({ 
        vehicle: 'motorcycle',
        apikey: envVariables.VIETMAP_API_KEY,
        points_encoded: true, 
        optimize: false
      }),
    ) 
```

### Traveling Salesman Problem (TSP)
The Traveling Salesman Problem (TSP) is a well-known mathematical problem in computer science and operations research. Given a set of cities and the distances between them, the TSP requires finding the shortest possible route that visits each city exactly once and returns to the starting city. This problem can be applied to the context of maps and routing, where the cities represent locations and the distances represent travel distances or travel times.

```typescript
  const res = await vietmapApi.tsp(
    [
      [10.79628438955497, 106.70592293472612],
      [10.801891047584164, 106.70660958023404],
    ],
    new TSPRequest({
      vehicle: 'car',
      apikey: envVariables.VIETMAP_API_KEY,
      points_encoded: true,
      optimize: true,
      round_trip: true,
    }),
  );
```

### Polyline decode
The routing API will respond to the route path in the encrypted string. 
You must use the Polyline decode to convert it to `LatLng`. 

Note: VietMap route api response encrypted point in polyline 5 format, please 
```typescript
  const polyline = new Polyline()
  const listLatLng = polyline.decode('c_hjS}s{`A{C}`@',5)
```

If you need to decode the polyline with `[lng, lat]` output format, you can use the `decodeLongLat` function.
```typescript
  const polyline = new Polyline()
  const listLatLng = polyline.decodeLongLat('c_hjS}s{`A{C}`@',5)
```

### Split route by a latLng
Split a route (contains a list of `latLng`), support for show driver tracking with the provided route. This function helps you split the provided route into 2 routes, one is driver traveled route, and one is the rest of the route. 
```tsx
    const line = [
      [106.70594000000001, 10.79631],
      [106.70664000000001, 10.79593],
      [106.70673000000001, 10.795890000000002],
      [106.70700000000001, 10.79579],
      [106.70727000000001, 10.795720000000001],
      [106.70743, 10.79568],
      [106.70758000000001, 10.79565],
      [106.70778000000001, 10.795570000000001],
      [106.70811, 10.795430000000001],
      [106.70828, 10.79536],
      [106.70841000000001, 10.795300000000001],
      [106.70929000000001, 10.794820000000001],
      [106.70932, 10.79479],
      [106.70985, 10.795340000000001],
      [106.70999, 10.795530000000001],
      [106.71006000000001, 10.79565],
      [106.71013, 10.795850000000002],
      [106.71019000000001, 10.79601],
      [106.71034, 10.7964],
      [106.71050000000001, 10.796830000000002],
      [106.71056000000002, 10.797],
      [106.71071, 10.79738]
    ];
    const point = [106.70929000000001, 10.794820000000001];
    const [line1, line2] = VietmapPolyline.splitRouteByLatLng(
      line as LatLng[],
      point as LatLng,
    ); 

    /// The response is:

    expect(line1).toEqual([
      [106.70594000000001, 10.79631],
      [106.70664000000001, 10.79593],
      [106.70673000000001, 10.795890000000002],
      [106.70700000000001, 10.79579],
      [106.70727000000001, 10.795720000000001],
      [106.70743, 10.79568],
      [106.70758000000001, 10.79565],
      [106.70778000000001, 10.795570000000001],
      [106.70811, 10.795430000000001],
      [106.70828, 10.79536],
      [106.70841000000001, 10.795300000000001],
      [106.70929000000001, 10.794820000000001],
    ]);
    expect(line2).toEqual([
      [106.70929000000001, 10.794820000000001],
      [106.70929000000001, 10.794820000000001],
      [106.70932, 10.79479],
      [106.70985, 10.795340000000001],
      [106.70999, 10.795530000000001],
      [106.71006000000001, 10.79565],
      [106.71013, 10.795850000000002],
      [106.71019000000001, 10.79601],
      [106.71034, 10.7964],
      [106.71050000000001, 10.796830000000002],
      [106.71056000000002, 10.797],
      [106.71071, 10.79738]])
```

</br>
</br>

[<img src="https://bizweb.dktcdn.net/100/415/690/themes/804206/assets/logo.png?1689561872933" height="40"/> </p>](https://vietmap.vn/maps-api)
Email us: [maps-api.support@vietmap.vn](mailto:maps-api.support@vietmap.vn)



Contact for [support](https://vietmap.vn/lien-he)

Vietmap API document [here](https://maps.vietmap.vn/docs/map-api/overview/)

Have a bug to report? [Open an issue](https://github.com/vietmap-company/vietmap_api_react_native/issues). If possible, include a full log and information that shows the issue.
Have a feature request? [Open an issue](https://github.com/vietmap-company/vietmap_api_react_native/issues). Tell us what the feature should do and why you want the feature.