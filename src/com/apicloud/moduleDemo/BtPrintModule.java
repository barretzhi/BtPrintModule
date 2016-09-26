package com.apicloud.moduleDemo;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
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
import android.os.Handler;
import android.os.Message;
import android.util.Log;
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
	public static final int MESSAGE_FAILED = 5;
	public static final int MESSAGE_LOST = 6;

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
	// 扫描到的蓝牙设备
	private JSONArray mNewDevicesArrayAdapter;
	// 蓝牙扫描的状态
	private int scanStatus = 3;
	// 蓝牙连接结果
	private JSONObject isconnectStatus;

	// 扫描状态
	private boolean scanstatue = true;

	// 连接状态
	private boolean connectfalg = true;

	// 创建线程
	private Thread scanthead;

	private Thread connectthread;

	private int iscStatus;

	public BtPrintModule(UZWebView webView) {
		super(webView);
		mNewDevicesArrayAdapter = new JSONArray();
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
		if (mService == null) {
			mService = new BluetoothService(mContext, mHandler);
		}
		try {
			JSONObject json = new JSONObject();
			json.put("code", 0);
			json.put("status", true);
			moduleContext.success(json, true);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}

	/**
	 * @name 蓝牙是否打开
	 * @param moduleContext
	 */
	public void jsmethod_isOpen(UZModuleContext moduleContext) {
		try {
			JSONObject json = new JSONObject();
			if (mBluetoothAdapter.isEnabled()) {
				json.put("code", 0);
				json.put("status", true);
			} else {
				json.put("code", 1);
				json.put("status", false);
			}
			moduleContext.success(json, true);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}

	/**
	 * @name 打开蓝牙
	 */
	public void jsmethod_openBt(UZModuleContext moduleContext) {
		// 打开蓝牙
		if (!mBluetoothAdapter.isEnabled()) {
			JSONObject ret = new JSONObject();
			try {
				ret.put("status", mBluetoothAdapter.enable());
			} catch (JSONException e) {
				// TODO 自动生成的 catch 块
				e.printStackTrace();
			}
			moduleContext.success(ret, true);
		}
	}

	/**
	 * @name 关闭蓝牙
	 */
	public void jsmethod_closeBt() {
		if (mBluetoothAdapter.isEnabled()) {
			mBluetoothAdapter.disable();
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
					service.put("name", device.getName());
					service.put("address", device.getAddress());
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
	public void jsmethod_scanBT(final UZModuleContext moduleContext) {
		// Register for broadcasts when a device is discovered
		IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
		mContext.registerReceiver(mReceiver, filter);

		// Register for broadcasts when discovery has finished
		filter = new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
		mContext.registerReceiver(mReceiver, filter);
		// 清空扫描记录
		if (mNewDevicesArrayAdapter.length() > 0) {
			mNewDevicesArrayAdapter = new JSONArray();
		}
		// 判断是否正在扫描
		if (mBluetoothAdapter.isDiscovering()) {
			// 取消扫描
			mBluetoothAdapter.cancelDiscovery();
		}
		// 开始执行扫描
		mBluetoothAdapter.startDiscovery();
		scanthead = new Thread() {

			public void run() {
				while (scanstatue) {
					try {
						Thread.sleep(200);
					} catch (InterruptedException e) {
						// TODO: handle exception
						e.printStackTrace();
					}
					if (scanStatus == 0) {
						Log.i("scan", "sanend");
						JSONObject ret = new JSONObject();
						try {
							ret.put("code", 0);
							ret.put("status", scanStatus);
							ret.put("service", mNewDevicesArrayAdapter);
						} catch (JSONException e) {
							// TODO 自动生成的 catch 块
							e.printStackTrace();
						}
						moduleContext.success(ret, true);
						scanStatus = 3;
						scanstatue = false;
					} else if (scanStatus == 1) {
						scanstatue = false;
					}
				}
			}
		};
		scanthead.start();
	}

	/**
	 * @name 连接设备
	 * @param moduleContext
	 */
	public void jsmethod_connectBt(final UZModuleContext moduleContext) {
		String address = moduleContext.optString("address");
		if (address == null) {
			JSONObject result = new JSONObject();
			try {
				result.put("status", false);
				result.put("msg", "没有蓝牙设备");
				moduleContext.success(result, false);
			} catch (JSONException e) {
				// TODO 自动生成的 catch 块
				e.printStackTrace();
			}
		} else {
			BluetoothDevice device = mBluetoothAdapter.getRemoteDevice(address);
			// 连接设备
			mService.stop();
			mService.connect(device);
			connectthread = new Thread() {
				public void run() {
					while (connectfalg) {
						try {
							Thread.sleep(200);
						} catch (InterruptedException e) {
							// TODO: handle exception
							e.printStackTrace();
						}
						if (iscStatus == 0) {
							JSONObject ret = new JSONObject();
							try {
								isconnectStatus.put("code", iscStatus);
								moduleContext.success(isconnectStatus, true);
							} catch (JSONException e) {
								// TODO 自动生成的 catch 块
								e.printStackTrace();
							}
							moduleContext.success(ret, true);
							connectfalg = false;
						} else if (iscStatus == 2) {
							JSONObject ret = new JSONObject();
							try {
								isconnectStatus.put("code", 2);
								moduleContext.success(isconnectStatus, true);
							} catch (JSONException e) {
								// TODO 自动生成的 catch 块
								e.printStackTrace();
							}
							moduleContext.success(ret, true);
						}
					}
				}
			};
			connectthread.start();
		}
	}

	/**
	 * @name 关闭扫描
	 */
	public void jsmethod_disscanBT() {
		mBluetoothAdapter.cancelDiscovery();
		mContext.unregisterReceiver(mReceiver);
	}

	/**
	 * @name 判断蓝牙是否连接成功
	 * @param moduleContext
	 */
	public void jsmethod_isconnect(UZModuleContext moduleContext) {
		try {
			isconnectStatus.put("code", mService.getState());
			moduleContext.success(isconnectStatus, true);
		} catch (JSONException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
	}

	/**
	 * @name 写入字符串
	 * @param moduleContext
	 */
	public void jsmethod_writeBT(UZModuleContext moduleContext) {
		byte[] writeStr = strTobyte(moduleContext.optString("writeStr"));
		mService.write(writeStr);
	}

	/**
	 * @name 打印订单消息
	 * @param moduleContext
	 */
	public void jsmethod_sendMessageBT(UZModuleContext moduleContext) {
		int num = moduleContext.optInt("num");

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
		for (int i = 0; i < num; i++) {
			printorder(moduleContext);
		}
		try {
			result.put("status", true);
			result.put("msg", "打印完毕");
			moduleContext.success(result, true);
		} catch (JSONException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}

	}

	public void printorder(UZModuleContext moduleContext) {
		JSONArray foods = moduleContext.optJSONArray("detail");
		// Check that there's actually something to send

		// Get the message bytes and tell the BluetoothService to write
		mService.printReset();
		mService.print(17);
		mService.printCenter();
		String storeName = moduleContext.isNull("store_name") ? "易客商圈"
				: moduleContext.optString("store_name");
		mService.write(strTobyte(storeName));
		mService.write(strTobyte("\n"));
		// 桌号
		mService.printSize(2);
		mService.printCenter();
		String seatNum = moduleContext.isNull("code_name") ? " "
				: moduleContext.optString("code_name");
		mService.write(strTobyte("就餐桌号: " + seatNum));
		mService.write(strTobyte("\n"));

		mService.printReset();
		mService.write(strTobyte("--------------------------------"));
		mService.write(strTobyte("\n"));
		// 就餐人数
		// mService.write(strTobyte("就餐人数:"));
		// String peopleNum = moduleContext.isNull("peopleNum") ? " " :
		// moduleContext.optString("peopleNum");
		// mService.printOffset(stringWidth(peopleNum));
		// mService.write(strTobyte(peopleNum));
		// mService.write(strTobyte("\n"));

		// mService.write(strTobyte("--------------------------------"));
		// 菜品类目
		mService.write(strTobyte("菜品"));
		mService.printOffset(186);
		mService.write(strTobyte("数量"));
		mService.printOffset(305);
		mService.write(strTobyte("单价"));
		mService.write(strTobyte("\n"));
		// 菜品
		for (int i = 0; i < foods.length(); i++) {
			try {
				JSONObject jsonobject = foods.getJSONObject(i);
				mService.printReset();
				mService.print(18);
				mService.write(strTobyte(jsonobject.isNull("title") ? " "
						: jsonobject.getString("title")));
				mService.printOffset(186);
				mService.write(strTobyte("x"
						+ (jsonobject.isNull("num") ? " " : jsonobject
								.getString("num"))));
				mService.printOffset(305);
				mService.write(strTobyte("￥"
						+ (jsonobject.isNull("price") ? " " : jsonobject
								.getString("price"))));
				mService.write(strTobyte("\n"));
			} catch (JSONException e) {
				// TODO 自动生成的 catch 块
				e.printStackTrace();
			}
		}

		mService.printReset();
		mService.write(strTobyte("--------------------------------"));
		mService.write(strTobyte("\n"));
		// 价格总计
		mService.write(strTobyte("总计:"));
		String orderAcount = moduleContext.isNull("total_fee") ? " "
				: moduleContext.optString("total_fee");
		mService.printOffset(stringWidth(orderAcount));
		mService.write(strTobyte(orderAcount));
		mService.write(strTobyte("\n"));
		// 备注
		mService.write(strTobyte("备注:"));
		String orderRemark = moduleContext.isNull("remark") ? ""
				: moduleContext.optString("remark");
		mService.printOffset(stringWidth(orderRemark));
		mService.write(strTobyte(orderRemark));
		mService.write(strTobyte("\n"));
		// 支付方式
		// mService.write(strTobyte("支付方式:"));
		// String orderPayType = moduleContext.isNull("orderPayType") ? " " :
		// moduleContext.optString("orderPayType");
		// mService.printOffset(stringWidth(orderPayType));
		// mService.write(strTobyte(orderPayType));
		// mService.write(strTobyte("\n"));

		mService.write(strTobyte("--------------------------------"));
		mService.write(strTobyte("\n"));
		// 订单时间
		mService.write(strTobyte("时间:"));
		String orderDate = moduleContext.isNull("created_at") ? " "
				: moduleContext.optString("created_at");
		mService.printOffset(stringWidth(orderDate + "89989"));
		mService.write(strTobyte(orderDate));
		mService.write(strTobyte("\n"));
		// 订单编号
		mService.write(strTobyte("订单号:"));
		String orderNum = moduleContext.isNull("billno") ? " " : moduleContext
				.optString("billno");
		mService.printOffset(stringWidth(orderNum + "899"));
		mService.write(strTobyte(orderNum));
		mService.write(strTobyte("\n"));
		// 商家地址
		mService.write(strTobyte("商家地址:"));
		String storeAddress = moduleContext.isNull("storeAddress") ? " "
				: moduleContext.optString("storeAddress");
		mService.write(strTobyte(storeAddress));
		mService.write(strTobyte("\n"));
		// 留白
		mService.write(strTobyte("\n"));
		mService.write(strTobyte("\n"));
		mService.write(strTobyte("\n"));
		mService.write(strTobyte("\n"));
	}

	/**
	 * @name 字符串转byte
	 * @param msg
	 * @return
	 */
	public byte[] strTobyte(String msg) {
		String msg_info = null;
		byte[] send = null;
		if (msg.length() > 0) {
			msg_info = msg;
		} else {
			msg_info = " ";
		}
		try {
			send = msg_info.getBytes("GB2312");
		} catch (UnsupportedEncodingException e) {
			send = msg_info.getBytes();
		}
		return send;
	}

	/**
	 * 获取字符串的宽度
	 * 
	 * @param str
	 * @return
	 */
	public int stringWidth(String str) {
		Paint paint = new Paint();
		paint.setTextSize(18);
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
							deviceInfo.put("name", device.getName());
							deviceInfo.put("address", device.getAddress());
							if (!mNewDevicesArrayAdapter.equals(deviceInfo)) {
								mNewDevicesArrayAdapter.put(deviceInfo);
							}
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
						scanStatus = 1;
					} else {
						scanStatus = 0;
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
						iscStatus = 0;
						break;
					case BluetoothService.STATE_CONNECTING:
						iscStatus = 1;
						break;
					case BluetoothService.STATE_NONE:
						iscStatus = 2;
						break;
					}
					break;
				case MESSAGE_WRITE:
					// byte[] writeBuf = (byte[]) msg.obj;
					// construct a string from the buffer
					// String writeMessage = new String(writeBuf);
					// Toast.makeText(mContext, "写入" + writeMessage,
					// Toast.LENGTH_SHORT).show();
					break;
				case MESSAGE_READ:
					// byte[] readBuf = (byte[]) msg.obj;
					// construct a string from the valid bytes in the buffer
					// String readMessage = new String(readBuf, 0, msg.arg1);
					// Toast.makeText(mContext, "读取" + readMessage,
					// Toast.LENGTH_SHORT).show();
					break;
				case MESSAGE_DEVICE_NAME:

					iscStatus = 3;

					break;
				case MESSAGE_FAILED:
					iscStatus = 4;
					break;
				case MESSAGE_LOST:
					iscStatus = 5;
					// mConnectedDeviceName =
					// msg.getData().getString(DEVICE_NAME);
					// isconnectStatus.put("code", 4);
					// isconnectStatus.put("address", mConnectedDeviceName);
					// isconnectStatus.put("msg", "已经连接成功");
					// Toast.makeText(mContext, msg.getData().getString(TOAST),
					// Toast.LENGTH_SHORT).show();
					break;
				}
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}
	};
	// --------------------------------------wifi-----------------------
	private pos pos;

	public void jsmethod_wifiPrint(UZModuleContext moduleContext) {
		String ip = moduleContext.optString("ip");
		int port = moduleContext.optInt("port");
		try {
			pos = new pos(ip, port);
			int num = moduleContext.optInt("num");
			for (int i = 0; i < num; i++) {
				wifiorder(moduleContext);
			}
		} catch (IOException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}

	}

	public void wifiorder(UZModuleContext moduleContext) {
		JSONArray foods = moduleContext.optJSONArray("detail");
		// Check that there's actually something to send

		// Get the message bytes and tell the BluetoothService to write
		pos.printReset();
		pos.print(17);
		pos.printCenter();
		String storeName = moduleContext.isNull("store_name") ? "易客商圈"
				: moduleContext.optString("store_name");
		pos.write(strTobyte(storeName));
		pos.write(strTobyte("\n"));
		// 桌号
		pos.printSize(2);
		pos.printCenter();
		String seatNum = moduleContext.isNull("code_name") ? " "
				: moduleContext.optString("code_name");
		pos.write(strTobyte("就餐桌号: " + seatNum));
		pos.write(strTobyte("\n"));

		pos.printReset();
		pos.write(strTobyte("--------------------------------"));
		pos.write(strTobyte("\n"));
		// 就餐人数
		// mService.write(strTobyte("就餐人数:"));
		// String peopleNum = moduleContext.isNull("peopleNum") ? " " :
		// moduleContext.optString("peopleNum");
		// mService.printOffset(stringWidth(peopleNum));
		// mService.write(strTobyte(peopleNum));
		// mService.write(strTobyte("\n"));

		// mService.write(strTobyte("--------------------------------"));
		// 菜品类目
		pos.write(strTobyte("菜品"));
		pos.printOffset(186);
		pos.write(strTobyte("数量"));
		pos.printOffset(305);
		pos.write(strTobyte("单价"));
		pos.write(strTobyte("\n"));
		// 菜品
		for (int i = 0; i < foods.length(); i++) {
			try {
				JSONObject jsonobject = foods.getJSONObject(i);
				pos.printReset();
				pos.print(18);
				pos.write(strTobyte(jsonobject.isNull("title") ? " "
						: jsonobject.getString("title")));
				pos.printOffset(186);
				pos.write(strTobyte("x"
						+ (jsonobject.isNull("num") ? " " : jsonobject
								.getString("num"))));
				pos.printOffset(305);
				pos.write(strTobyte("￥"
						+ (jsonobject.isNull("price") ? " " : jsonobject
								.getString("price"))));
				pos.write(strTobyte("\n"));
			} catch (JSONException e) {
				// TODO 自动生成的 catch 块
				e.printStackTrace();
			}
		}

		pos.printReset();
		pos.write(strTobyte("--------------------------------"));
		pos.write(strTobyte("\n"));
		// 价格总计
		pos.write(strTobyte("总计:"));
		String orderAcount = moduleContext.isNull("total_fee") ? " "
				: moduleContext.optString("total_fee");
		pos.printOffset(stringWidth(orderAcount));
		pos.write(strTobyte(orderAcount));
		pos.write(strTobyte("\n"));
		// 备注
		pos.write(strTobyte("备注:"));
		String orderRemark = moduleContext.isNull("remark") ? ""
				: moduleContext.optString("remark");
		pos.printOffset(stringWidth(orderRemark));
		pos.write(strTobyte(orderRemark));
		pos.write(strTobyte("\n"));
		// 支付方式
		// mService.write(strTobyte("支付方式:"));
		// String orderPayType = moduleContext.isNull("orderPayType") ? " " :
		// moduleContext.optString("orderPayType");
		// mService.printOffset(stringWidth(orderPayType));
		// mService.write(strTobyte(orderPayType));
		// mService.write(strTobyte("\n"));

		pos.write(strTobyte("--------------------------------"));
		pos.write(strTobyte("\n"));
		// 订单时间
		pos.write(strTobyte("时间:"));
		String orderDate = moduleContext.isNull("created_at") ? " "
				: moduleContext.optString("created_at");
		pos.printOffset(stringWidth(orderDate + "89989"));
		pos.write(strTobyte(orderDate));
		pos.write(strTobyte("\n"));
		// 订单编号
		pos.write(strTobyte("订单号:"));
		String orderNum = moduleContext.isNull("billno") ? " " : moduleContext
				.optString("billno");
		pos.printOffset(stringWidth(orderNum + "899"));
		pos.write(strTobyte(orderNum));
		pos.write(strTobyte("\n"));
		// 商家地址
		pos.write(strTobyte("商家地址:"));
		String storeAddress = moduleContext.isNull("storeAddress") ? " "
				: moduleContext.optString("storeAddress");
		pos.write(strTobyte(storeAddress));
		pos.write(strTobyte("\n"));
		// 留白
		pos.write(strTobyte("\n"));
		pos.write(strTobyte("\n"));
		pos.write(strTobyte("\n"));
		pos.write(strTobyte("\n"));
	}
}
