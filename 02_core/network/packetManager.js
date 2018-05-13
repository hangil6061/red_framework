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
            var decoder = new Red.Packet.Decoder(packet);
            return decoder.decode(protocols);
        },
    };

    return PacketManager;
})();