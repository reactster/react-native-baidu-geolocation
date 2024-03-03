package com.elka.reactster.baidugeolocation.support

import android.app.Activity
import android.content.pm.PackageManager
import android.os.Build

import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

import com.elka.reactster.baidugeolocation.constant.RequestCode

object AppUtils {
   fun checkPermission(activity: Activity, permission: String) {
       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
           activity.applicationInfo.targetSdkVersion >= Build.VERSION_CODES.M &&
           !hasPermission(activity, permission)
       ) {
           ActivityCompat.requestPermissions(activity, arrayOf(permission), RequestCode.CODE_ASK_PERMISSIONS)
       }
   }

   fun hasPermission(activity: Activity, permission: String): Boolean =
       ContextCompat.checkSelfPermission(activity, permission) == PackageManager.PERMISSION_GRANTED
}