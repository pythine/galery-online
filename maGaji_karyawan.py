#INPUT
golongan = input("Masukkan golongan (A/B/C): ").upper()
jam_lembur = int(input("Masukkan jumlah jam lembur: "))

if golongan == "A":
    gaji_pokok = 5000000
elif golongan == "B":
    gaji_pokok = 6500000
elif golongan == "C":
    gaji_pokok = 9500000
else:
    gaji_pokok = 0
    print("Golongan tidak valid!")

if jam_lembur == 1:
    persentase = 0.30
elif jam_lembur == 2:
    persentase = 0.32
elif jam_lembur == 3:
    persentase = 0.34
elif jam_lembur == 4:
    persentase = 0.36
elif jam_lembur >= 5:
    persentase = 0.38
else:
    persentase = 0.0

gaji_lembur = gaji_pokok * persentase
total_penghasilan = gaji_pokok + gaji_lembur

# OUTPUT
print(f"\n--- Rincian Gaji ---")
print(f"Gaji Pokok        : Rp {gaji_pokok:,.0f}")
print(f"Persentase Lembur : {persentase * 100:.0f}%")
print(f"Gaji Lembur       : Rp {gaji_lembur:,.0f}")
print(f"--------------------")
print(f"Total Penghasilan : Rp {total_penghasilan:,.0f}")
