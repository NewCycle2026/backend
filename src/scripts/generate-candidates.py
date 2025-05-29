


from faker import Faker
import random
import json
from datetime import datetime, timedelta

fake = Faker()

# ✅ 존재하는 trip/user id 범위
trip_id_min, trip_id_max = 1, 200
user_id_min, user_id_max = 1, 300

# ✅ 데이터 생성 수
num_entries = 2000
statuses = ["suggested", "accepted", "rejected"]

data = []

for _ in range(num_entries):
    trip_id = random.randint(trip_id_min, trip_id_max)
    candidate_id = random.randint(user_id_min, user_id_max)
    match_score = random.randint(50, 100)
    status = random.choice(statuses)
    created_at = fake.date_time_between(start_date="-1y", end_date="now").isoformat()

    data.append({
        "tripId": trip_id,
        "candidateId": candidate_id,
        "matchScore": match_score,
        "status": status,
        "createdAt": created_at
    })

# ✅ JSON 저장 경로
output_path = "./src/scripts/companion_matching_candidates_2000.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ {num_entries}개 매칭 후보 데이터 생성 완료 → {output_path}")

