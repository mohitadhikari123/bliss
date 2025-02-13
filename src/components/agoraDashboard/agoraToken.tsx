import { RtcTokenBuilder, RtcRole } from "agora-access-token";

const agoraToken = (channel : string,userId  : string) => {
    try {
        const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
        const appCertificate = process.env.NEXT_PUBLIC_AGORA_APP_CERTIFICATE;
        const channelName = channel;
        const uid = 0;
        const role = RtcRole.PUBLISHER;
        const tokenExpirationInSecond = 3600;
        const privilegeExpireTime = Math.floor(Date.now() / 1000) + tokenExpirationInSecond;
        console.log("privilegeExpireTime:", privilegeExpireTime, "Current Time:", Math.floor(Date.now() / 1000));


       
        if (appId == undefined || appId == "" || appCertificate == undefined || appCertificate == "") {
            console.log("Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE");
            return;
        }

        // Generate Token
        const token = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            uid,
            role,
            privilegeExpireTime
        ); 
        console.log("Agora Token Debug Info:", {
            appId,
            appCertificate,
            channelName,
            uid,
            role,
            privilegeExpireTime,
        });

        console.log("Token with int uid:", token);
        return token;
    } catch (error) {

    } 
}

export default agoraToken;