package com.cloche.app;
 
import android.os.Bundle;
import android.graphics.Color;
import android.view.View;
import com.getcapacitor.BridgeActivity;
 
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
 
        getWindow().setStatusBarColor(Color.parseColor("#0d0d0d"));
        getWindow().setNavigationBarColor(Color.parseColor("#0d0d0d"));
    }
}