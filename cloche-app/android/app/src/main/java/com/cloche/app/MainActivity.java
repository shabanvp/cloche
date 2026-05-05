package com.cloche.app;

import android.os.Bundle;
import android.graphics.Color;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.os.Build;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // Ensure the window can draw the system bar backgrounds
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

        // Set status bar and navigation bar to app background color (#0d0d0d)
        String colorHex = "#0d0d0d";
        window.setStatusBarColor(Color.parseColor(colorHex));
        window.setNavigationBarColor(Color.parseColor(colorHex));

        // Ensure system icons are light (white) for the dark background
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            View decorView = window.getDecorView();
            int flags = decorView.getSystemUiVisibility();
            
            // Removing the LIGHT_STATUS_BAR flag ensures icons are light
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                // Removing the LIGHT_NAVIGATION_BAR flag ensures icons are light
                flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            }
            
            decorView.setSystemUiVisibility(flags);
        }
    }
}
