/**
 * @name apicloud  打印模块
 * @author barret.zhi
 */
package com.apicloud.moduleDemo;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.apicloud.moduleDemo.BluetoothService;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Paint;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import com.uzmap.pkg.uzcore.UZWebView;
import com.uzmap.pkg.uzcore.uzmodule.UZModule;
import com.uzmap.pkg.uzcore.uzmodule.UZModuleContext;

public class BtPrintModule extends UZModule {

	// Message types sent from the BluetoothService Handler
	public static final int MESSAGE_STATE_CHANGE = 1;
	public static final int MESSAGE_READ = 2;
	public static final int MESSAGE_WRITE = 3;
	public static final int MESSAGE_DEVICE_NAME = 4;
	public static final int MESSAGE_TOAST = 5;

	// Key names received from the BluetoothService Handler
	public static final String DEVICE_NAME = "device_name";
	public static final String TOAST = "toast";

	// Intent request codes
	private static final int REQUEST_CONNECT_DEVICE = 1;
	private static final int REQUEST_ENABLE_BT = 2;

	// Name of the connected device
	private String mConnectedDeviceName = null;
	// Local Bluetooth adapter
	private BluetoothAdapter mBluetoothAdapter = null;
	// Member object for the services
	public static BluetoothService mService = null;
	//扫描到的蓝牙设备
	private JSONArray mNewDevicesArrayAdapter;
	//蓝牙扫描的状态
	private JSONObject scanStatus;
	//蓝牙连接结果
	private JSONObject isconnectStatus;

	public BtPrintModule(UZWebView webView) {
		super(webView);
		mNewDevicesArrayAdapter = new JSONArray();
		scanStatus = new JSONObject();
		isconnectStatus = new JSONObject();
	}

	/**
	 * @name 初始化蓝牙
	 * @param moduleContext
	 */
	public void jsmethod_initBT(UZModuleContext moduleContext) {
		// Get local Bluetooth adapter
		mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();

		// If the adapter is null, then Bluetooth is not supported
		if (mBluetoothAdapter == null) {
			Toast.makeText(mContext, "您的设备不支持蓝牙", 0).show();
			return;
		}

		if (!mBluetoothAdapter.isEnabled()) {
			// 打开蓝牙
			Intent enableIntent = new Intent(
					BluetoothAdapter.ACTION_REQUEST_ENABLE);
			startActivityForResult(enableIntent, REQUEST_ENABLE_BT);
		}
		if (mService == null) {
			mService = new BluetoothService(mContext, mHandler);
		}

	}

	/**
	 * @name 配对历史
	 * @param moduleContext
	 */
	public void jsmethod_hostoryBt(UZModuleContext moduleContext) {
		// Get a set of currently paired devices
		Set<BluetoothDevice> pairedDevices = mBluetoothAdapter
				.getBondedDevices();

		// If there are paired devices, add each one to the ArrayAdapter
		if (pairedDevices.size() > 0) {
			try {
				JSONArray json = new JSONArray();
				for (BluetoothDevice device : pairedDevices) {
					JSONObject service = new JSONObject();
					service.put("name",device.getName());
					service.put("address",device.getAddress());
					json.put(service);
				}
				JSONObject ret = new JSONObject();
				ret.put("service", json);
				moduleContext.success(ret, true);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}

		} else {
			Toast.makeText(mContext, "没有已匹配的设备", 0).show();
		}
	}

	/**
	 * @name 扫描蓝牙
	 * @param moduleContext
	 */
	public void jsmethod_scanBT(UZModuleContext moduleContext) {
		// Register for broadcasts when a device is discovered
		IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
		mContext.registerReceiver(mReceiver, filter);

		// Register for broadcasts when discovery has finished
		filter = new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
		mContext.registerReceiver(mReceiver, filter);
		// 清空扫描记录
		if (mNewDevicesArrayAdapter.length() > 0) {
			mNewDevicesArrayAdapter = new JSONArray();
			scanStatus = new JSONObject();
		}
		// 判断是否正在扫描
		if (mBluetoothAdapter.isDiscovering()) {
			// 取消扫描
			mBluetoothAdapter.cancelDiscovery();
		}
		// 开始执行扫描
		mBluetoothAdapter.startDiscovery();
	}

	/**
	 * @name 获得未配对的设备
	 * @param moduleContext
	 */
	public void jsmethod_serviceBT(UZModuleContext moduleContext) {
		JSONObject ret = new JSONObject();
		try {
			if (scanStatus.getString("status") != null) {
				ret.put("code", 0);
				ret.put("status", scanStatus);
				ret.put("service", mNewDevicesArrayAdapter);
				moduleContext.success(ret, true);
				// Make sure we're not doing discovery anymore
				if (mBluetoothAdapter != null) {
					mBluetoothAdapter.cancelDiscovery();
				}
			} else {
				ret.put("code", 1);
				moduleContext.success(ret, true);
			}
			
		} catch (JSONException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
	}

	/**
	 * @name 连接设备
	 * @param moduleContext
	 */
	public void jsmethod_connectBt(UZModuleContext moduleContext) {
		String address = moduleContext.optString("address");
		if(address == null){
			JSONObject result = new JSONObject();
			try {
				result.put("status", false);
				result.put("msg", "没有蓝牙设备");
				moduleContext.success(result, false);
			} catch (JSONException e) {
				// TODO 自动生成的 catch 块
				e.printStackTrace();
			}
		}else{
			BluetoothDevice device = mBluetoothAdapter.getRemoteDevice(address);
			//连接设备
			mService.connect(device);
		}
	}
	/**
	 * @name 判断蓝牙是否连接成功
	 * @param moduleContext
	 */
	public void jsmethod_isconnect(UZModuleContext moduleContext){
			moduleContext.success(isconnectStatus, true);
	}
	/**
	 * @name 写入字符串
	 * @param moduleContext
	 */
	public void jsmethod_writeBT(UZModuleContext moduleContext){
			byte[] writeStr = strTobyte(moduleContext.optString("writeStr"));
			mService.write(writeStr);
	}
	/**
	 * @name 打印订单消息
	 * @param moduleContext
	 */
	public void jsmethod_sendMessageBT(UZModuleContext moduleContext) {
		JSONArray foods = moduleContext.optJSONArray("foods");
		JSONObject result = new JSONObject();
		if (mService.getState() != BluetoothService.STATE_CONNECTED) {
			try {
				result.put("status", false);
				result.put("msg", "蓝牙没有连接");
				moduleContext.success(result, true);
			} catch (JSONException e) {
				// TODO 自动生成的 catch 块
				e.printStackTrace();
			}
			return;
		}

		// Check that there's actually something to send

		// Get the message bytes and tell the BluetoothService to write
		mService.printReset();
		mService.print(17);
		mService.printCenter();
		String storeName = moduleContext.isNull("storeName") ? " " : moduleContext.optString("storeName");
		mService.write(strTobyte(storeName));
		mService.write(strTobyte("\n"));
		//桌号
		mService.printSize(2);
		mService.printCenter();
		String seatNum = moduleContext.isNull("seatNum") ? " " : moduleContext.optString("seatNum");
		mService.write(strTobyte("就餐桌号: " + seatNum));
		mService.write(strTobyte("\n"));
		
		mService.printReset();
		mService.write(strTobyte("--------------------------------"));
		mService.write(strTobyte("\n"));
		//就餐人数
		mService.write(strTobyte("就餐人数:"));
		String peopleNum = moduleContext.isNull("peopleNum") ? " " : moduleContext.optString("peopleNum");
		mService.printOffset(stringWidth(peopleNum));
		mService.write(strTobyte(peopleNum));
		mService.write(strTobyte("\n"));
		//备注
		mService.write(strTobyte("备注:"));
		String orderRemark = moduleContext.isNull("orderRemark") ? " " : moduleContext.optString("orderRemark");
		mService.printOffset(stringWidth(orderRemark));
		mService.write(strTobyte(orderRemark));
		mService.write(strTobyte("\n"));
		
		mService.write(strTobyte("--------------------------------"));
		//菜品类目
		mService.write(strTobyte("菜品"));  
		mService.printOffset(186);
		mService.write(strTobyte("数量"));
		mService.printOffset(305);
		mService.write(strTobyte("单价"));
		mService.write(strTobyte("\n"));
		//菜品
		for (int i = 1; i < foods.length(); i++ ){
			try {
				JSONObject jsonobject = foods.getJSONObject(i);  
				mService.print(18);
				mService.write(strTobyte(jsonobject.isNull("name") ? " " : jsonobject.getString("name")));
				mService.printOffset(186);
				mService.write(strTobyte("x"+ (jsonobject.isNull("num") ? " " : jsonobject.getString("num"))));
				mService.printOffset(305);
				mService.write(strTobyte(jsonobject.isNull("money") ? " " : jsonobject.getString("money")));
				mService.write(strTobyte("\n"));
			} catch (JSONException e) {
				// TODO 自动生成的 catch 块
				e.printStackTrace();
			}
		}
		
		mService.printReset();
		mService.write(strTobyte("--------------------------------"));
		mService.write(strTobyte("\n"));
		//价格总计
		mService.write(strTobyte("总计:"));
		String orderAcount = moduleContext.isNull("orderAcount") ? " " : moduleContext.optString("orderAcount");
		mService.printOffset(stringWidth(orderAcount));
		mService.write(strTobyte(orderAcount));
		mService.write(strTobyte("\n"));
		//支付方式
		mService.write(strTobyte("支付方式:"));
		String orderPayType = moduleContext.isNull("orderPayType") ? " " : moduleContext.optString("orderPayType");
		mService.printOffset(stringWidth(orderPayType));
		mService.write(strTobyte(orderPayType));
		mService.write(strTobyte("\n"));
		
		mService.write(strTobyte("--------------------------------"));
		mService.write(strTobyte("\n"));
		//订单时间
		mService.write(strTobyte("时间:"));
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String orderDate = df.format(new Date());
		mService.printOffset(stringWidth(orderDate));
		mService.write(strTobyte(orderDate));
		mService.write(strTobyte("\n"));
		//订单编号
		mService.write(strTobyte("订单号:"));
		String orderNum = moduleContext.isNull("orderNum") ? " " : moduleContext.optString("orderNum");
		mService.printOffset(stringWidth(orderNum));
		mService.write(strTobyte(orderNum));
		mService.write(strTobyte("\n"));
		//商家地址
		mService.write(strTobyte("商家地址:"));
		String storeAddress = moduleContext.isNull("storeAddress") ? " " : moduleContext.optString("storeAddress");
		mService.write(strTobyte(storeAddress));
		mService.write(strTobyte("\n"));
		//留白
		mService.write(strTobyte("\n"));
		mService.write(strTobyte("\n"));
		mService.write(strTobyte("\n"));
		mService.write(strTobyte("\n"));
		try {
			result.put("status", true);
			result.put("msg", "打印完毕");
			moduleContext.success(result, true);
		} catch (JSONException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
		
	}
	/**
	 * @name 字符串转byte
	 * @param msg
	 * @return
	 */
	public byte[] strTobyte(String msg) {
		byte[] send = null;
		if (msg.length() > 0) {

			try {
				send = msg.getBytes("GB2312");
			} catch (UnsupportedEncodingException e) {
				send = msg.getBytes();
			}
		}
		return send;
	}
	/**
	 * 获取字符串的宽度
	 * @param str
	 * @return
	 */
	public int stringWidth(String str){
		Paint paint= new Paint(); 
		paint.setTextSize(22);
		int strWidth = (int) paint.measureText(str);
		return 368 - strWidth;
	}
	// 监听周围蓝牙设备
	private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			String action = intent.getAction();

			// 当蓝牙扫描到一个设备
			if (BluetoothDevice.ACTION_FOUND.equals(action)) {
				// Get the BluetoothDevice object from the Intent
				BluetoothDevice device = intent
						.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
				// If it's already paired, skip it, because it's been listed
				// already
				if (device.getBondState() != BluetoothDevice.BOND_BONDED) {
					JSONObject deviceInfo = new JSONObject();
					if (device.getName() != null && device.getAddress() != null) {
						try {
							deviceInfo.put("name",device.getName());
							deviceInfo.put("address", device.getAddress());
							mNewDevicesArrayAdapter.put(deviceInfo);
						} catch (JSONException e) {
							// TODO 自动生成的 catch 块
							e.printStackTrace();
						}
					}
				}
				// 当蓝牙扫描结束
			} else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED
					.equals(action)) {
				try {
					if (mNewDevicesArrayAdapter.length() == 0) {
						scanStatus.put("status", false);
					} else {
						scanStatus.put("status", true);
					}
					mContext.unregisterReceiver(mReceiver);
				} catch (Exception e) {
					// TODO: handle exception
					e.printStackTrace();
				}

			}
		}
	};

	private final Handler mHandler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			try {
				switch (msg.what) {
				case MESSAGE_STATE_CHANGE:
					switch (msg.arg1) {
					case BluetoothService.STATE_CONNECTED:
						isconnectStatus.put("code", 0);
						isconnectStatus.put("address", mConnectedDeviceName);
						isconnectStatus.put("msg", "已连接");
						break;
					case BluetoothService.STATE_CONNECTING:
						isconnectStatus.put("code", 1);
						isconnectStatus.put("address", mConnectedDeviceName);
						isconnectStatus.put("msg", "正在连接...");
						break;
					case BluetoothService.STATE_NONE:
						isconnectStatus.put("code", 2);
						isconnectStatus.put("address", mConnectedDeviceName);
						isconnectStatus.put("msg", "无连接");
						break;
					}
					break;
				case MESSAGE_WRITE:
//					 byte[] writeBuf = (byte[]) msg.obj;
//					 construct a string from the buffer
//					 String writeMessage = new String(writeBuf);
//					 Toast.makeText(mContext, "写入" + writeMessage,
//								Toast.LENGTH_SHORT).show();
					break;
				case MESSAGE_READ:
//					 byte[] readBuf = (byte[]) msg.obj;
					// construct a string from the valid bytes in the buffer
//					 String readMessage = new String(readBuf, 0, msg.arg1);
//					 Toast.makeText(mContext, "读取" + readMessage,
//								Toast.LENGTH_SHORT).show();
					break;
				case MESSAGE_DEVICE_NAME:
					// save the connected device's name
					mConnectedDeviceName = msg.getData().getString(DEVICE_NAME);
					isconnectStatus.put("code", 3);
					isconnectStatus.put("address", mConnectedDeviceName);
					isconnectStatus.put("msg", "连接至");
//					Toast.makeText(mContext, "连接至" + mConnectedDeviceName,
//							Toast.LENGTH_SHORT).show();
					break;
				case MESSAGE_TOAST:
					mConnectedDeviceName = msg.getData().getString(DEVICE_NAME);
					isconnectStatus.put("code", 4);
					isconnectStatus.put("address", mConnectedDeviceName);
					isconnectStatus.put("msg", "已经连接成功");
//					Toast.makeText(mContext, msg.getData().getString(TOAST),
//							Toast.LENGTH_SHORT).show();
					break;
				}
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}
	};

}
