package com.focus.unreel

import android.annotation.SuppressLint
import android.content.Context
import android.content.SharedPreferences
import android.content.res.Configuration
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var homeLayout: LinearLayout
    private lateinit var webLayout: FrameLayout
    private lateinit var fullScreenVideoContainer: FrameLayout
    private lateinit var webView: WebView

    private lateinit var tvDailyStat: TextView
    private lateinit var btnYoutube: Button
    private lateinit var btnInstagram: Button
    private lateinit var btnFacebook: Button

    private lateinit var btnPortal: LinearLayout
    private lateinit var ivPortalBack: ImageView
    private lateinit var tvPortalText: TextView
    private lateinit var vPortalDot: View
    private lateinit var tvSessionTimer: TextView

    private lateinit var prefs: SharedPreferences

    private var sessionSeconds = 0
    private var totalDailySeconds = 0
    private val handler = Looper.myLooper()?.let { Handler(it) } ?: Handler(Looper.getMainLooper())

    private var customVideoView: View? = null
    private var customVideoCallback: WebChromeClient.CustomViewCallback? = null

    private val sessionTimerRunnable = object : Runnable {
        override fun run() {
            if (webLayout.visibility == View.VISIBLE) {
                sessionSeconds++
                totalDailySeconds++

                // Save to persistent preferences
                saveDailySeconds(totalDailySeconds)

                // Update session timer UI
                updateSessionTimerUI(sessionSeconds)

                // Gentle 15-Minute Haptic Pulse
                if (sessionSeconds > 0 && sessionSeconds % 900 == 0) {
                    triggerHapticPulse()
                }

                handler.postDelayed(this, 1000)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        prefs = getSharedPreferences("unreel_prefs", Context.MODE_PRIVATE)

        initViews()
        setupWebView()
        setupListeners()
        setupBackHandler()

        // Restore persistent today's time
        totalDailySeconds = loadDailySeconds()
        updateDailyStatUI(totalDailySeconds)
    }

    private fun initViews() {
        homeLayout = findViewById(R.id.homeLayout)
        webLayout = findViewById(R.id.webLayout)
        fullScreenVideoContainer = findViewById(R.id.fullScreenVideoContainer)
        webView = findViewById(R.id.webView)

        tvDailyStat = findViewById(R.id.tvDailyStat)
        btnYoutube = findViewById(R.id.btnYoutube)
        btnInstagram = findViewById(R.id.btnInstagram)
        btnFacebook = findViewById(R.id.btnFacebook)

        btnPortal = findViewById(R.id.btnPortal)
        ivPortalBack = findViewById(R.id.ivPortalBack)
        tvPortalText = findViewById(R.id.tvPortalText)
        vPortalDot = findViewById(R.id.vPortalDot)
        tvSessionTimer = findViewById(R.id.tvSessionTimer)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.mediaPlaybackRequiresUserGesture = false
        settings.allowFileAccess = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.builtInZoomControls = false
        settings.displayZoomControls = false

        // Enable hardware layer
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)

        // Cookie Manager for persistent login
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                injectBlockerCSS(view, url)
            }
        }

        // Fix: Enable YouTube Fullscreen Video Support!
        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
                if (customVideoView != null) {
                    onHideCustomView()
                    return
                }

                customVideoView = view
                customVideoCallback = callback

                fullScreenVideoContainer.addView(
                    view,
                    FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                )
                fullScreenVideoContainer.visibility = View.VISIBLE
                webLayout.visibility = View.GONE

                // Set immersive fullscreen flags
                hideSystemUI()
            }

            override fun onHideCustomView() {
                if (customVideoView == null) return

                fullScreenVideoContainer.removeView(customVideoView)
                fullScreenVideoContainer.visibility = View.GONE
                webLayout.visibility = View.VISIBLE

                customVideoView = null
                customVideoCallback?.onCustomViewHidden()

                showSystemUI()
            }
        }
    }

    private fun setupListeners() {
        btnYoutube.setOnClickListener { openApp("https://m.youtube.com") }
        btnInstagram.setOnClickListener { openApp("https://www.instagram.com") }
        btnFacebook.setOnClickListener { openApp("https://m.facebook.com") }

        btnPortal.setOnClickListener { closeAppToHome() }
    }

    private fun setupBackHandler() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // If custom fullscreen video is open, close video fullscreen first
                if (customVideoView != null) {
                    webView.webChromeClient?.onHideCustomView()
                    return
                }

                if (webLayout.visibility == View.VISIBLE) {
                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        closeAppToHome()
                    }
                } else {
                    finish()
                }
            }
        })
    }

    private fun openApp(url: String) {
        sessionSeconds = 0
        updateSessionTimerUI(0)

        homeLayout.visibility = View.GONE
        webLayout.visibility = View.VISIBLE

        webView.loadUrl(url)

        handler.removeCallbacks(sessionTimerRunnable)
        handler.post(sessionTimerRunnable)
    }

    private fun closeAppToHome() {
        handler.removeCallbacks(sessionTimerRunnable)

        // Save daily seconds
        saveDailySeconds(totalDailySeconds)
        updateDailyStatUI(totalDailySeconds)

        webView.loadUrl("about:blank")
        webLayout.visibility = View.GONE
        homeLayout.visibility = View.VISIBLE
    }

    private fun injectBlockerCSS(view: WebView?, url: String?) {
        if (view == null || url == null) return

        val css = when {
            url.contains("youtube.com") -> """
                /* Hide YouTube Shorts buttons & shelves */
                ytm-pivot-bar-renderer > ytm-pivot-bar-item-renderer:nth-child(2),
                ytm-pivot-bar-renderer > *:nth-child(2),
                ytm-pivot-bar-item-renderer[aria-label*="Shorts"],
                ytm-pivot-bar-item-renderer:has(a[href*="/shorts"]),
                a[href*="/shorts"],
                ytm-reel-shelf-renderer,
                ytm-rich-section-renderer:has(ytm-reel-shelf-renderer),
                ytm-rich-section-renderer:has(ytm-shorts-lockup-view-model),
                ytm-shorts-lockup-view-model,
                ytm-shorts-lockup-view-model-v2,
                ytm-reel-item-renderer,
                ytm-reel-shelf-renderer-layout,
                ytm-shorts-lockup-view-model-grid-renderer,
                ytm-item-section-renderer:has(ytm-reel-shelf-renderer),
                ytm-item-section-renderer:has(ytm-shorts-lockup-view-model),
                ytm-item-section-renderer:has(a[href*="/shorts"]),
                ytm-video-with-context-renderer:has(a[href*="/shorts"]),
                ytm-compact-video-renderer:has(a[href*="/shorts"]),
                ytm-mealbar-promo-renderer,
                .dialog-overlay,
                [data-content-type*="shorts"] {
                    display: none !important;
                }
            """.trimIndent()

            url.contains("instagram.com") -> """
                /* Hide Instagram Reels tab & trays */
                a[href*="/reels/"],
                a[href="/reels/"],
                svg[aria-label="Reels"],
                svg[aria-label="Clips"],
                div[data-testid="reels_tray"],
                div:has(> a[href*="/reels/"]) {
                    display: none !important;
                }
            """.trimIndent()

            url.contains("facebook.com") -> """
                /* Hide Facebook Reels tabs, trays & Open App banners */
                div[role="tablist"] div[role="tab"]:nth-child(2),
                div[aria-label*="Reels"],
                div[aria-label*="reels"],
                div[aria-label*="Short videos"],
                div[data-sigil*="reels"],
                div[data-module-id*="reels"],
                div[role="feed"] > div:has(a[href*="/reel/"]),
                div[role="feed"] > div:has(a[href*="/reels/"]),
                div[role="article"]:has(a[href*="/reel/"]),
                div[role="article"]:has(a[href*="/reels/"]),
                div:has(> a[href*="/reel/"]),
                a[href*="/reel/"],
                a[href*="/reels/"],
                a[href*="/watch/reels/"],
                div[data-sigil*="m-app-banner"],
                div[data-sigil*="app_upsell"],
                div[id*="m-app-banner"],
                div[id*="app-banner"],
                div[class*="app_upsell"],
                div[class*="app-banner"],
                div:has(> a[href*="play.google.com"]) {
                    display: none !important;
                }
            """.trimIndent()

            else -> ""
        }

        if (css.isNotEmpty()) {
            val js = """
                (function() {
                    var style = document.getElementById('unreel-blocker-style');
                    if (!style) {
                        style = document.createElement('style');
                        style.id = 'unreel-blocker-style';
                        style.type = 'text/css';
                        style.appendChild(document.createTextNode(`$css`));
                        (document.head || document.documentElement).appendChild(style);
                    }
                })();
            """.trimIndent()
            view.evaluateJavascript(js, null)
        }
    }

    private fun updateSessionTimerUI(seconds: Int) {
        val mins = seconds / 60
        val secs = seconds % 60
        val text = String.format(Locale.getDefault(), "%02d:%02d", mins, secs)
        tvSessionTimer.text = text

        if (seconds >= 900) {
            btnPortal.setBackgroundResource(R.drawable.pill_amber_bg)
            tvPortalText.setTextColor(ContextCompat.getColor(this, R.color.amber_warning))
            tvSessionTimer.setTextColor(ContextCompat.getColor(this, R.color.amber_warning))
            vPortalDot.setBackgroundColor(ContextCompat.getColor(this, R.color.amber_warning))
        } else {
            btnPortal.setBackgroundResource(R.drawable.pill_bg)
            tvPortalText.setTextColor(ContextCompat.getColor(this, R.color.text_white))
            tvSessionTimer.setTextColor(ContextCompat.getColor(this, R.color.text_muted))
            vPortalDot.setBackgroundColor(Color.parseColor("#71717A"))
        }
    }

    private fun updateDailyStatUI(seconds: Int) {
        val mins = seconds / 60
        val hours = mins / 60
        val remMins = mins % 60

        val formatted = if (hours > 0) {
            "${hours}h ${remMins}m"
        } else {
            "${mins}m"
        }

        tvDailyStat.text = "TODAY • $formatted"
    }

    private fun getTodayDateString(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        return sdf.format(Date())
    }

    private fun loadDailySeconds(): Int {
        val savedDate = prefs.getString("last_date", "")
        val today = getTodayDateString()
        if (savedDate != today) {
            prefs.edit().putString("last_date", today).putInt("daily_seconds", 0).apply()
            return 0
        }
        return prefs.getInt("daily_seconds", 0)
    }

    private fun saveDailySeconds(seconds: Int) {
        prefs.edit().putString("last_date", getTodayDateString()).putInt("daily_seconds", seconds).apply()
    }

    private fun triggerHapticPulse() {
        val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator?.vibrate(VibrationEffect.createOneShot(400, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(400)
        }
    }

    private fun hideSystemUI() {
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        )
    }

    private fun showSystemUI() {
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
    }

    override fun onPause() {
        super.onPause()
        saveDailySeconds(totalDailySeconds)
    }
}
