// @flow
import * as Immutable from 'immutable';

declare type PrimitiveImmutable = String | Number | Boolean | null;
declare type JSONType = PrimitiveImmutable | JSONObject | JSONArray;
declare type JSONObject = { [key: string]: JSONType};
declare type JSONArray = Array<JSONType>;


/* This is the definition of JSON that Flow provides adapted for Immutable*/

type ImmutableJSON = 
| String
| Number
| Boolean
| null
| ImmutableJSONMap
| ImmutableJSONList;

type ImmutableJSONMap = Immutable.Map<String, ImmutableJSON>;

type ImmutableJSONList = Immutable.List<ImmutableJSON>;