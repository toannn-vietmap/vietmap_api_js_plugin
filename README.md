
A Dart package for using the [VietMap APIs](https://maps.vietmap.vn/docs/map-api/overview/) in JS/TS.

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

### Reverse and 
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
  new SearchRequest({ text: 'Vietmap' }),
);
```

### Search - Geocode
Updating Geocode 3.0 API is a powerful tool for developers to integrate location search functionality into their applications with optimized performance. Additionally, this latest version utilizes intelligent search algorithms and methods to provide accurate and speedy search results for users.
```typescript

const searchResponseList = await vietmapApi.search(
  new SearchRequest({ text: 'Vietmap' }),
);
```
### Routing
A Route Maps API is a feature provided by VIETMAP that allows developers to calculate and display the optimal route between two or more locations on a map. With a Route Maps API, developers can specify the start and end points of a journey, along with any additional constraints such as preferred mode of transportation, and retrieve a detailed route that can be displayed on a map. The API may also provide information such as the total distance, estimated travel time, and turn-by-turn directions. Developers can use Route Maps APIs to create applications that help with navigation, transportation planning, and logistics management.

```typescript
    const res = await vietmapApi.autoCompleteSearch(
      new  SearchRequest({ text: 'Vietmap', apikey: envVariables.VIETMAP_API_KEY, focus:[10, 106] }),
    )
```

### Polyline decode
The routing API will respond to the route path in the encrypted string. 
You must use the Polyline decode to convert it to `LatLng`. 
```typescript
  const polyline = new Polyline()
  const listLatLng = polyline.decode('c_hjS}s{`A{C}`@',5)
```

</br>
</br>

[<img src="https://bizweb.dktcdn.net/100/415/690/themes/804206/assets/logo.png?1689561872933" height="40"/> </p>](https://vietmap.vn/maps-api)
Email us: [maps-api.support@vietmap.vn](mailto:maps-api.support@vietmap.vn)



Contact for [support](https://vietmap.vn/lien-he)

Vietmap API document [here](https://maps.vietmap.vn/docs/map-api/overview/)

Have a bug to report? [Open an issue](https://github.com/vietmap-company/vietmap_api_react_native/issues). If possible, include a full log and information that shows the issue.
Have a feature request? [Open an issue](https://github.com/vietmap-company/vietmap_api_react_native/issues). Tell us what the feature should do and why you want the feature.