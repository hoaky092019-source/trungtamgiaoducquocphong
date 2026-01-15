import React, { useEffect, useRef } from 'react';

const ElFinderPage = () => {
    const elfinderRef = useRef(null);

    useEffect(() => {
        // Hàm load script tu động
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        // Hàm load CSS
        const loadCSS = (href) => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        };

        const initElFinder = async () => {
            // 1. Load jQuery & jQuery UI (nếu chưa có)
            // Lưu ý: elFinder cần jQuery.

            // Load CSS
            loadCSS('//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css');
            loadCSS('//cdnjs.cloudflare.com/ajax/libs/elfinder/2.1.65/css/elfinder.min.css');
            loadCSS('//cdnjs.cloudflare.com/ajax/libs/elfinder/2.1.65/css/theme.min.css');

            try {
                // Load JS dependencies theo thứ tự
                if (!window.jQuery) {
                    await loadScript('//cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js');
                }
                if (!window.jQuery.ui) {
                    await loadScript('//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js');
                }

                await loadScript('//cdnjs.cloudflare.com/ajax/libs/elfinder/2.1.65/js/elfinder.min.js');
                // Optional: Load Lang (vi)
                await loadScript('//cdnjs.cloudflare.com/ajax/libs/elfinder/2.1.65/js/i18n/elfinder.vi.min.js');

                // 2. Initialize elFinder
                if (window.jQuery && elfinderRef.current) {
                    window.jQuery(elfinderRef.current).elfinder({
                        url: 'http://localhost:5076/el-finder/connector', // Backend connection
                        lang: 'vi',
                        height: '100%',
                        defaultView: 'list',
                        commandsOptions: {
                            edit: {
                                editors: [
                                    {
                                        mimes: ['text/plain', 'text/html', 'text/javascript', 'text/css'],
                                        load: function (textarea) {
                                            // Custom editor loader if needed
                                        },
                                        save: function (textarea, editor) {
                                            // Custom editor saver
                                            window.jQuery(textarea).val(editor.getValue());
                                        }
                                    }
                                ]
                            }
                        }
                    });
                }

            } catch (error) {
                console.error("Failed to load elFinder scripts", error);
            }
        };

        initElFinder();

        // Cleanup
        return () => {
            if (elfinderRef.current && window.jQuery) {
                try {
                    window.jQuery(elfinderRef.current).elfinder('destroy');
                } catch (e) {
                    // Ignore destroy errors
                }
            }
        };

    }, []);

    return (
        <div className="h-[85vh] w-full p-4 bg-gray-50">
            <div className="bg-white rounded-lg shadow-lg h-full overflow-hidden border border-gray-200">
                <div ref={elfinderRef} id="elfinder" className="h-full w-full" />
            </div>
        </div>
    );
};

export default ElFinderPage;
