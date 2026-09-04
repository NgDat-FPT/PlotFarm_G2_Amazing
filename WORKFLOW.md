# 🔄 Quy trình làm việc — PlotFarm (G2 Amazing)

Tài liệu này quy định cách nhóm phối hợp trên Git, viết code và đưa tính năng lên production.

---

## 1. Mô hình nhánh (Branching Model)

```
main                 ← code chạy production, luôn ổn định
 └── develop         ← nhánh tích hợp, mọi feature merge vào đây
      ├── feature/plot-map
      ├── feature/care-request
      ├── fix/rental-overlap
      └── ...
```

| Nhánh | Mục đích | Ai được push |
|---|---|---|
| `main` | Bản chạy thật, chỉ nhận merge từ `develop` khi release | Không ai push trực tiếp |
| `develop` | Tích hợp tính năng, luôn build được | Chỉ qua Pull Request |
| `feature/<tên>` | Phát triển 1 tính năng | Người phụ trách |
| `fix/<tên>` | Sửa lỗi | Người phụ trách |
| `hotfix/<tên>` | Sửa lỗi khẩn trên production, nhánh từ `main` | Team lead |

### Đặt tên nhánh

```
feature/plot-map            ✅
feature/care-request-status ✅
fix/rental-date-overlap     ✅
feature/Sua_loi             ❌ (không dùng tiếng Việt có dấu / viết hoa / gạch dưới)
```

---

## 2. Quy ước commit (Conventional Commits)

```
<type>(<scope>): <mô tả ngắn, tiếng Việt không dấu hoặc có dấu đều được>
```

| Type | Dùng khi |
|---|---|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa lỗi |
| `refactor` | Sửa code, không đổi hành vi |
| `style` | Format, đặt tên, không đổi logic |
| `docs` | Sửa tài liệu |
| `test` | Thêm/sửa test |
| `chore` | Cấu hình, dependency, CI |

**Ví dụ:**
```bash
git commit -m "feat(plots): them so do truc quan chon o dat"
git commit -m "fix(rentals): chan dat thue trung lich"
git commit -m "chore(ci): them workflow build client"
```

Một commit = một việc. Đừng gộp 5 tính năng vào một commit.

---

## 3. Vòng đời một tính năng

```bash
# 1. Cập nhật develop mới nhất
git checkout develop
git pull origin develop

# 2. Tạo nhánh feature
git checkout -b feature/care-request

# 3. Code + commit thường xuyên
git add .
git commit -m "feat(care-request): tao form gui yeu cau cham soc"

# 4. Đồng bộ với develop trước khi push (tránh conflict lớn)
git fetch origin
git rebase origin/develop

# 5. Push lên remote
git push -u origin feature/care-request

# 6. Mở Pull Request trên GitHub: feature/care-request → develop
# 7. Chờ CI xanh + ít nhất 1 người review approve
# 8. Merge (Squash and merge) rồi xoá nhánh
```

---

## 4. Quy tắc Pull Request

Một PR được merge khi đủ **cả 4** điều kiện:

- ✅ CI (`.github/workflows/ci.yml`) chạy pass
- ✅ Có ít nhất **1 approve** từ thành viên khác
- ✅ Đã điền đầy đủ mô tả theo template
- ✅ Không còn comment `Request changes` chưa xử lý

**Nguyên tắc review:**
- PR nên nhỏ hơn ~400 dòng thay đổi để review được tử tế.
- Người review phản hồi trong vòng 24h.
- Góp ý vào code, không vào người viết code.
- Không tự approve PR của chính mình.

**Cấu hình nhánh được bảo vệ** (Settings → Branches → Add rule) cho `main` và `develop`:
- Require a pull request before merging → Require 1 approval
- Require status checks to pass → chọn job `Client (React)` và `Server (Node.js)`
- Do not allow bypassing the above settings

---

## 5. Xử lý conflict

```bash
git fetch origin
git rebase origin/develop
# Mở file bị conflict, sửa, giữ lại phần đúng
git add <file-da-sua>
git rebase --continue
git push --force-with-lease
```

> Chỉ dùng `--force-with-lease` trên nhánh feature của riêng mình. **Không bao giờ** force push lên `develop` hoặc `main`.

---

## 6. Quy trình Sprint (2 tuần / sprint)

| Hoạt động | Thời điểm | Nội dung |
|---|---|---|
| Sprint Planning | Thứ 2 đầu sprint | Chọn task từ backlog, ước lượng, gán người |
| Daily Standup | Mỗi ngày, 15 phút | Hôm qua làm gì, hôm nay làm gì, đang vướng gì |
| Sprint Review | Thứ 6 cuối sprint | Demo tính năng đã xong |
| Retrospective | Sau review | Cái gì tốt, cái gì cần cải thiện |

Quản lý task bằng **GitHub Projects** với các cột:
`Backlog → To Do → In Progress → In Review → Done`

Mỗi Issue cần có: mô tả, tiêu chí hoàn thành (acceptance criteria), label (`module:plots`, `type:feature`, `priority:high`), người phụ trách.

---

## 7. Định nghĩa "Hoàn thành" (Definition of Done)

Một task chỉ được kéo sang `Done` khi:

- [ ] Code chạy đúng theo tiêu chí hoàn thành của Issue
- [ ] Đã tự test các luồng chính và luồng lỗi
- [ ] Có validate input ở cả client và server
- [ ] Có xử lý loading & error state trên UI
- [ ] Đã kiểm tra phân quyền (vai trò khác không truy cập được)
- [ ] Không còn `console.log` thừa, không hard-code URL/key
- [ ] PR đã được merge vào `develop`

---

## 8. Quy tắc bảo mật khi làm việc

- ❌ **Không bao giờ commit** file `.env`, `service_role key`, hay khoá cổng thanh toán.
- ✅ Chỉ commit `.env.example` với giá trị rỗng.
- ✅ Khoá dùng cho CI/CD đặt trong **GitHub → Settings → Secrets and variables → Actions**.
- ✅ Nếu lỡ push khoá lên GitHub: **rotate khoá ngay trên Supabase**, xoá commit không đủ — khoá đã bị lộ.
- ✅ Mỗi thành viên có thể tạo project Supabase riêng để dev, dùng chung một project cho staging.

---

## 9. Môi trường triển khai

| Môi trường | Nhánh | Frontend | Backend | Database |
|---|---|---|---|---|
| Development | `feature/*` | localhost:5173 | localhost:5000 | Supabase dev project |
| Staging | `develop` | Vercel preview | Render (staging) | Supabase staging |
| Production | `main` | Vercel production | Render (production) | Supabase production |

Migration database chạy theo thứ tự file trong `supabase/migrations/`. Khi thêm bảng/cột mới, **luôn tạo file migration mới**, không sửa file cũ đã chạy.

---

## 10. Checklist trước khi release lên `main`

- [ ] Toàn bộ tính năng của sprint đã merge vào `develop`
- [ ] CI xanh trên `develop`
- [ ] Đã test end-to-end luồng chính: thuê ô → chọn cây → gửi yêu cầu → xem camera → thu hoạch
- [ ] Đã chạy migration trên database production
- [ ] Đã cập nhật biến môi trường trên Vercel & Render
- [ ] Đã tạo tag phiên bản: `git tag -a v1.0.0 -m "Release 1.0.0"`
