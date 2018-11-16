/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Components.utils.import("resource://gre/modules/Services.jsm");

function nsAttachmentOpener()
{
}

nsAttachmentOpener.prototype =
{
    QueryInterface: function(iid)
    {
        if (iid.equals(Components.interfaces.nsIURIContentListener) ||
            iid.equals(Components.interfaces.nsIInterfaceRequestor) ||
            iid.equals(Components.interfaces.nsISupports))
            return this;
        throw Components.results.NS_NOINTERFACE;
    },

    onStartURIOpen: function(uri)
    {
        return false;
    },

    doContent: function(contentType, isContentPreferred, request, contentHandler)
    {
        return false;
    },

    isPreferred: function(contentType, desiredContentType)
    {
        return false;
    },

    canHandleContent: function(contentType, isContentPreferred, desiredContentType)
    {
        return false;
    },

    getInterface: function(iid)
    {
        if (iid.equals(Components.interfaces.nsIDOMWindow))
            return window;
        else
            return this.QueryInterface(iid);
    },

    loadCookie: null,
    parentContentListener: null,
}

function openAll() {
    let bucket = window.arguments[2];
    let nattach = bucket.getRowCount();
    try{
        for(let i = 0; i < nattach; i++) {
            let item = bucket.getItemAtIndex(i);
            let attachmentUrl = item.attachment.url;
            let messagePrefix = /^mailbox-message:|^imap-message:|^news-message:/i;
            if (messagePrefix.test(attachmentUrl)) {
                let msgHdr = gMessenger.messageServiceFromURI(attachmentUrl).
                             messageURIToMsgHdr(attachmentUrl);
                if (msgHdr) {
                    MailUtils.openMessageInNewWindow(msgHdr);
                }
            } else {
                // turn the url into a nsIURL object then open it
                let url = Services.io.newURI(attachmentUrl, null, null);
                url = url.QueryInterface( Components.interfaces.nsIURL );
                if (url) {

                    if ( Services.vc.compare(Services.appinfo.platformVersion, '58') < 0 ) {
                        let channel = Services.io.newChannelFromURI(url);
                    } else {
                        // This may change to the following in the future:
                        //     let channel = NetUtil.newChannel({ uri: url, loadUsingSystemPrincipal: true });
                        //     or
                        // let channel = NetUtil.newChannel({
                        // uri: url,
                        // loadingPrincipal: principal,
                        // securityFlags: SEC_ALLOW_CROSS_ORIGIN_DATA_INHERITS,
                        // contentPolicyType: Ci.nsIContentPolicy.TYPE_OTHER
                        // });

                        let channel = Services.io.newChannelFromURI2(url,
                                                                     null,      // aLoadingNode
                                                                     Services.scriptSecurityManager.getSystemPrincipal(),
                                                                     null,      // aTriggeringPrincipal
                                                                     Ci.nsILoadInfo.SEC_NORMAL,
                    } // if (Tbird > v58) -> else

                    if (channel) {
                        let uriLoader = Components.classes["@mozilla.org/uriloader;1"].
                        getService(Components.interfaces.nsIURILoader);
                        uriLoader.openURI(channel, true, new nsAttachmentOpener());
                    } // if channel
                } // if url
            }
        } // if one attachment selected
    } catch(e) {
        err("error in openall " + e);
    }
}
