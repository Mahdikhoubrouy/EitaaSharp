using EitaaSharp.Tl;

namespace EitaaSharp.Tl.Tests;

public class TlPrimitiveTests
{
    private static byte[] Write(Action<TlWriter> write)
    {
        var w = new TlWriter();
        write(w);
        return w.ToArray();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(-1)]
    [InlineData(int.MaxValue)]
    [InlineData(int.MinValue)]
    [InlineData(94575)]
    public void Int32_RoundTrips(int value)
    {
        var bytes = Write(w => w.WriteInt32(value));
        Assert.Equal(4, bytes.Length);
        Assert.Equal(value, new TlReader(bytes).ReadInt32());
    }

    [Theory]
    [InlineData(0L)]
    [InlineData(1L)]
    [InlineData(-1L)]
    [InlineData(long.MaxValue)]
    [InlineData(long.MinValue)]
    [InlineData(0x1122334455667788L)]
    public void Long_RoundTrips(long value)
    {
        var bytes = Write(w => w.WriteLong(value));
        Assert.Equal(8, bytes.Length);
        Assert.Equal(value, new TlReader(bytes).ReadLong());
    }

    [Fact]
    public void Long_IsCanonicalLittleEndian()
    {
        // Verified against JS: long(1) => 01 00 00 00 00 00 00 00 (low dword first).
        Assert.Equal("0100000000000000",
            Convert.ToHexString(Write(w => w.WriteLong(1))).ToLowerInvariant());
        Assert.Equal("8877665544332211",
            Convert.ToHexString(Write(w => w.WriteLong(0x1122334455667788L))).ToLowerInvariant());
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(253)]
    [InlineData(254)]
    [InlineData(255)]
    [InlineData(1000)]
    public void Bytes_RoundTrip_AndPaddedToMultipleOf4(int length)
    {
        var data = new byte[length];
        for (int i = 0; i < length; i++) data[i] = (byte)(i & 0xFF);

        var bytes = Write(w => w.WriteBytes(data));
        Assert.Equal(0, bytes.Length % 4);

        var read = new TlReader(bytes).ReadBytes();
        Assert.Equal(data, read);
    }

    [Theory]
    [InlineData("")]
    [InlineData("hello")]
    [InlineData("+989123456789")]
    [InlineData("سلام دنیا")] // multi-byte UTF-8
    public void String_RoundTrips_AsUtf8(string value)
    {
        var bytes = Write(w => w.WriteString(value));
        Assert.Equal(0, bytes.Length % 4);
        Assert.Equal(value, new TlReader(bytes).ReadString());
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void Bool_RoundTrips(bool value)
    {
        var bytes = Write(w => w.WriteBool(value));
        Assert.Equal(value, new TlReader(bytes).ReadBool());
    }

    [Fact]
    public void Vector_RoundTrips_WithTag()
    {
        int[] items = [10, 20, 30];
        var bytes = Write(w => w.WriteVector(items, (ww, x) => ww.WriteInt32(x)));

        var reader = new TlReader(bytes);
        var read = reader.ReadVector(r => r.ReadInt32());
        Assert.Equal(items, read);
    }

    [Fact]
    public void Vector_Empty_RoundTrips()
    {
        int[] items = [];
        var bytes = Write(w => w.WriteVector(items, (ww, x) => ww.WriteInt32(x)));
        Assert.Equal(8, bytes.Length); // tag + count, no items
        Assert.Equal(items, new TlReader(bytes).ReadVector(r => r.ReadInt32()));
    }

    [Fact]
    public void Int128_And_Int256_RoundTrip()
    {
        var b128 = new byte[16];
        var b256 = new byte[32];
        for (int i = 0; i < 16; i++) b128[i] = (byte)(i + 1);
        for (int i = 0; i < 32; i++) b256[i] = (byte)(i + 100);

        var v128 = new TlInt128(b128);
        var v256 = new TlInt256(b256);

        var bytes = Write(w => { w.WriteInt128(v128); w.WriteInt256(v256); });
        Assert.Equal(48, bytes.Length);

        var reader = new TlReader(bytes);
        Assert.Equal(v128, reader.ReadInt128());
        Assert.Equal(v256, reader.ReadInt256());
    }

    [Fact]
    public void Double_RoundTrips()
    {
        var bytes = Write(w => w.WriteDouble(3.14159265358979));
        Assert.Equal(3.14159265358979, new TlReader(bytes).ReadDouble(), 12);
    }
}
