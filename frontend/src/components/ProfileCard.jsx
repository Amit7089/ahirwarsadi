import { Heart, MapPin, GraduationCap, Briefcase } from "lucide-react";

function ProfileCard({ profile }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-xl transition duration-300 group">

      {/* Profile Image */}
      <div className="relative overflow-hidden">
        <img
          src={profile.image}
          alt="Matrimonial profile"
          className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
        />

        <button
          aria-label="Add to shortlist"
          className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md text-rose-700 hover:bg-rose-700 hover:text-white transition"
        >
          <Heart size={20} />
        </button>

        <span className="absolute bottom-4 left-4 bg-rose-700 text-white text-xs px-3 py-1.5 rounded-full">
          Featured
        </span>
      </div>

      {/* Profile Details */}
      <div className="p-5">

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {profile.name}
          </h3>

          <span className="text-sm text-rose-700 font-medium">
            {profile.age} yrs
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Profile ID: {profile.id}
        </p>

        <div className="mt-4 space-y-3 text-sm text-gray-600">

          <p className="flex items-center gap-2">
            <GraduationCap size={18} className="text-rose-700" />
            {profile.education}
          </p>

          <p className="flex items-center gap-2">
            <Briefcase size={18} className="text-rose-700" />
            {profile.occupation}
          </p>

          <p className="flex items-center gap-2">
            <MapPin size={18} className="text-rose-700" />
            {profile.location}
          </p>

        </div>

        <button className="w-full mt-5 border border-rose-700 text-rose-800 py-3 rounded-xl font-medium hover:bg-rose-800 hover:text-white transition">
          View Profile
        </button>

      </div>
    </div>
  );
}

export default ProfileCard;