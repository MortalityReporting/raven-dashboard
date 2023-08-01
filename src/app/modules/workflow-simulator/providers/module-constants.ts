import {RequestType} from "../model/request-type";
import {ConnectionType} from "../model/connection-type";

export const RequestTypeOptions = [RequestType.GET, RequestType.PUT, RequestType.POST];


export const ConnectionTypeOptions: Record<ConnectionType, { value: ConnectionType; name: string }> = {
  [ConnectionType.basicAuth]: { value: ConnectionType.basicAuth, name: 'Basic Auth' },
  [ConnectionType.token]: { value: ConnectionType.token, name: 'Bearer Token' },
  [ConnectionType.custom]: { value: ConnectionType.custom, name: 'Custom' }
};
