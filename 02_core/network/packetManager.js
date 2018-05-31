var Red = Red || {};

Red.PacketManager = (function ()
{
    function PacketManager(game)
    {
        this.game = game;
    }

    PacketManager.prototype = {
        encode : function (packetType, param)
        {
            return new Red.Packet.Encoder(packetType).encode(param).commitPacket();
        },

        decode : function (protocols, packet)
        {
            return new Promise((resolve, reject) =>
            {
                (new Red.Packet.Decoder(packet))
                .then((decoder) =>
                {
                    return resolve(decoder.decode(protocols));
                })
                .catch((err) =>
                {
                    console.error(err.stack);
                    reject(err);
                });
            });
        },
    };

    return PacketManager;
})();