import { EventEmitter, Injectable } from '@angular/core';
import ConfigbeeClient from 'configbee-client-core';
import { normalizeKeys } from './utils';

const NOT_INITED_ERROR = "This Service is not initilized yet. Please call init beform using NgxConfigbeeService."
const ALREADY_INITED_ERROR = "This Service is already initilized."

export interface UpdateEvent{
  status: ConfigbeeClient.CbStatusType
  targetingStatus: ConfigbeeClient.CbStatusType

  flags: ConfigbeeClient.CbFlagsType | undefined
  numbers: ConfigbeeClient.CbNumbersType | undefined
  texts: ConfigbeeClient.CbTextsType | undefined
  jsons: ConfigbeeClient.CbJsonsType | undefined
}

@Injectable({
  providedIn: 'root'
})
export class NgxConfigbeeService {

  private _updatesEmitor:EventEmitter<UpdateEvent>;

  private _status:ConfigbeeClient.CbStatusType | undefined
  private _targetingStatus:ConfigbeeClient.CbStatusType | undefined

  private _normalizeKeys: boolean
  private _cbClient:ConfigbeeClient.Client | undefined
  private _flags: ConfigbeeClient.CbFlagsType
  private _numbers: ConfigbeeClient.CbNumbersType
  private _texts: ConfigbeeClient.CbTextsType
  private _jsons: ConfigbeeClient.CbJsonsType

  public get updates(){
    return this._updatesEmitor.asObservable()
  }

  public get status():ConfigbeeClient.CbStatusType {
    if(this._status == undefined){
      throw NOT_INITED_ERROR
    }
    return this._status
  }

  public get targetingStatus():ConfigbeeClient.CbStatusType {
    if(this._targetingStatus == undefined){
      throw NOT_INITED_ERROR
    }
    return this._targetingStatus
  }

  public get isActive() {
    return this._status === "ACTIVE"
  }

  public get isLoading() {
    return this._status === "INITIALIZING"
  }

  public get isTargetingActive() {
    return this._targetingStatus === "ACTIVE"
  }

  public get isTargetingLoading() {
    return this._targetingStatus === "INITIALIZING"
  }

  public get flags():any {
    if(this._status == undefined){
      throw NOT_INITED_ERROR
    }
    return this._flags
  }
  public get numbers():any {
    if(this._status == undefined){
      throw NOT_INITED_ERROR
    }
    return this._numbers
  }
  public get texts():any {
    if(this._status == undefined){
      throw NOT_INITED_ERROR
    }
    return this._texts
  }
  public get jsons():any {
    if(this._status == undefined){
      throw NOT_INITED_ERROR
    }
    return this._jsons
  }

  constructor() {
    this._flags = {}
    this._numbers = {}
    this._texts = {}
    this._jsons = {}
    this._normalizeKeys = true
    this._status = undefined
    this._targetingStatus = undefined
    this._updatesEmitor= new EventEmitter()
  }

  private onUpdate() {
    this._status = this._cbClient!.status
    this._targetingStatus = this._cbClient!.targetingStatus

    let flags = this._cbClient!.getAllFlags()
    let numbers = this._cbClient!.getAllNumbers()
    let texts = this._cbClient!.getAllTexts()
    let jsons = this._cbClient!.getAllJsons()
    if(this._normalizeKeys){
      if(flags)
        flags = normalizeKeys(flags)
      if(numbers)
        numbers = normalizeKeys(numbers)
      if(texts)
        texts = normalizeKeys(texts)
      if(jsons)
        jsons = normalizeKeys(jsons)
    }
    this._flags = flags
    this._numbers = numbers
    this._texts = texts
    this._jsons = jsons

    this._updatesEmitor.emit({
      status:this._status,
      targetingStatus:this._targetingStatus,
      flags:this._flags,
      numbers:this._numbers,
      texts:this._texts,
      jsons:this._jsons
    })
  }

  public init({accountId, projectId, environmentId,
    targetProperties,
    customSources, normalizeKeys=true}:{
    accountId: string,
    projectId: string,
    environmentId: string,
    targetProperties?: {[key: string]: string},
    customSources?: any,
    normalizeKeys?: boolean
  }){
    if(this._cbClient!=undefined){
      throw ALREADY_INITED_ERROR
    }
    this._normalizeKeys = normalizeKeys
    this._cbClient = ConfigbeeClient.init({
      accountId: accountId,
      projectId: projectId,
      environmentId: environmentId,
      targetProperties: targetProperties,
      sources: customSources,
      onReady: this.onUpdate.bind(this),
      onUpdate: this.onUpdate.bind(this)
    })
    this.onUpdate()
  }

  public setTargetProperties(targetProperties:{[key: string]: string}):void{
    if(this._cbClient == undefined){
      throw NOT_INITED_ERROR
    }
    this._cbClient.setTargetProperties(targetProperties)
  }
  public unsetTargetProperties():void{
    if(this._cbClient == undefined){
      throw NOT_INITED_ERROR
    }
    this._cbClient.unsetTargetProperties()
  }
}
