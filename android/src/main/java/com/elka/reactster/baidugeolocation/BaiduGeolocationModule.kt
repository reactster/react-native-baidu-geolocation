package com.elka.reactster.baidugeolocation

import android.Manifest
import android.util.Log

import androidx.annotation.NonNull

import com.baidu.location.BDLocation
import com.baidu.location.BDLocationListener
import com.baidu.location.LocationClient
import com.baidu.location.LocationClientOption
import com.baidu.location.LocationClientOption.LocationMode

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule

import com.elka.reactster.baidugeolocation.support.AppUtils

@ReactModule(name = BaiduGeolocationModule.NAME)
class BaiduGeolocationModule(reactContext: ReactApplicationContext) : 
  NativeBaiduGeolocationSpec(reactContext), BDLocationListener {
  private val context = reactContext

  private var listenerCount = 0
  private var locationClient: LocationClient? = null
  private var coorType: String = "bd09ll"

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "BaiduGeolocation"
  }

  private fun sendEvent(eventName: String, params: WritableMap) {
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventName, params)
  }

  private fun initLocationClient() {
    try {
      LocationClient.setAgreePrivacy(true)

      context.currentActivity?.let { AppUtils.checkPermission(it, Manifest.permission.READ_LOGS) }
      context.currentActivity?.let { AppUtils.checkPermission(it, Manifest.permission.FOREGROUND_SERVICE) }
      context.currentActivity?.let { AppUtils.checkPermission(it, Manifest.permission.ACCESS_FINE_LOCATION) }
      context.currentActivity?.let { AppUtils.checkPermission(it, Manifest.permission.ACCESS_COARSE_LOCATION) }
      context.currentActivity?.let { AppUtils.checkPermission(it, Manifest.permission.READ_EXTERNAL_STORAGE) }
      context.currentActivity?.let { AppUtils.checkPermission(it, Manifest.permission.WRITE_EXTERNAL_STORAGE) }
      context.currentActivity?.let { AppUtils.checkPermission(it, Manifest.permission.MOUNT_UNMOUNT_FILESYSTEMS) }

      val option = LocationClientOption().apply {
        setScanSpan(1500)
        setOpenGps(true)
        setOpenGnss(false)
        setCoorType(coorType)
        setIsNeedAddress(true)
        setIsNeedAltitude(true)
        setIgnoreKillProcess(true)
        setNeedDeviceDirect(false)
        setIsNeedLocationDescribe(false)
        setLocationMode(LocationMode.Hight_Accuracy)
        setFirstLocType(LocationClientOption.FirstLocType.SPEED_IN_FIRST_LOC)
      }

      if (locationClient == null) {
        locationClient = LocationClient(context.applicationContext).apply {
          registerLocationListener(this@BaiduGeolocationModule)
          setLocOption(option)
        }
      }
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  override fun setCoorType(type: String) {
    coorType = type
  }

  override fun addListener(eventName: String) {
    listenerCount++
    if (listenerCount == 1) {
      initLocationClient()
      locationClient?.start()
    }
  }
  
  override fun removeListeners(count: Double) {
    listenerCount -= count.toInt()
    if (listenerCount == 0) {
      locationClient?.stop()
    }
  }

  override fun onReceiveLocation(bdLocation: BDLocation) {
    val params = Arguments.createMap().apply {
      putDouble("latitude", bdLocation.latitude)
      putDouble("longitude", bdLocation.longitude)
      putDouble("speed", bdLocation.speed.toDouble())
      putDouble("direction", bdLocation.direction.toDouble())
      putDouble("altitude", bdLocation.altitude)
      putDouble("radius", bdLocation.radius.toDouble())
      putString("address", bdLocation.addrStr)
      putString("countryCode", bdLocation.countryCode)
      putString("country", bdLocation.country)
      putString("province", bdLocation.province)
      putString("cityCode", bdLocation.cityCode)
      putString("city", bdLocation.city)
      putString("district", bdLocation.district)
      putString("street", bdLocation.street)
      putString("streetNumber", bdLocation.streetNumber)
      putString("buildingId", bdLocation.buildingID)
      putString("buildingName", bdLocation.buildingName)
    }

    sendEvent("onUpdate", params)
  }
}
