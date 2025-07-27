import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { MapPin, Star, Phone, Refrigerator, Loader2, Box, CheckCircle } from "lucide-react";

export default function StoragePage() {
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    showModal: false,
    providerId: null,
    capacity: "",
    bookingInProgress: false,
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const [providersRes, bookingsRes] = await Promise.all([
      fetch('http://localhost:5000/api/storage'),
      fetch('http://localhost:5000/api/storage/bookings')
    ]);

    const providersData = await providersRes.json();
    const bookingsData = await bookingsRes.json();

    if (!providersData.success || !bookingsData.success) {
      throw new Error('Failed to fetch data');
    }

    setProviders(providersData.data);
    setBookings(bookingsData.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleBookNow = (providerId) => {
    setBookingData({
      showModal: true,
      providerId,
      capacity: "",
      bookingInProgress: false,
    });
  };

  const handleBookingSubmit = async () => {
    const { providerId, capacity } = bookingData;
    
    if (!capacity || isNaN(capacity) || capacity <= 0) {
      alert("Please enter a valid capacity greater than 0");
      return;
    }

    const numericCapacity = Number(capacity);
    const provider = providers.find(p => p._id === providerId);

    if (numericCapacity > provider.availableCapacity) {
      alert(`Only ${provider.availableCapacity} kg available`);
      return;
    }

    setBookingData(prev => ({ ...prev, bookingInProgress: true }));

    try {
      const response = await fetch('http://localhost:5000/api/storage/book-storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storageId: providerId,
          bookedCapacity: numericCapacity,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Booking failed');
      }

      // Refresh all data
      await fetchData();
      
      setBookingData({
        showModal: false,
        providerId: null,
        capacity: "",
        bookingInProgress: false,
      });
      
      alert(`Successfully booked ${numericCapacity} kg at ${provider.name}`);
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message || "Failed to book storage. Please try again.");
      setBookingData(prev => ({ ...prev, bookingInProgress: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Storage Providers
          </h1>
          <p className="text-gray-600">
            Find the perfect storage solution for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {providers.map((provider) => (
            <StorageCard 
              key={provider._id} 
              provider={provider} 
              onBookNow={handleBookNow}
            />
          ))}
        </div>

        {/* Bookings Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="mr-2 text-green-500" />
            Your Bookings
          </h2>
          
          {bookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-100 rounded-lg">
              <p className="text-gray-500">No bookings yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookedStorageCard key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingData.showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Book Storage</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Capacity (kg)
              </label>
              <input
                type="number"
                min="1"
                max={
                  providers.find(p => p._id === bookingData.providerId)?.availableCapacity || 0
                }
                value={bookingData.capacity}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  capacity: e.target.value
                }))}
                className="w-full p-2 border rounded"
                placeholder="Enter capacity in kg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available: {
                  providers.find(p => p._id === bookingData.providerId)?.availableCapacity || 0
                } kg
              </p>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span className="font-medium">Estimated Cost:</span>
                <span className="font-bold text-green-600">
                  ₹{
                    (bookingData.capacity * 
                    (providers.find(p => p._id === bookingData.providerId)?.ratePerKgPerDay || 0))
                    .toFixed(2)
                  }
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Rate: ₹{
                  providers.find(p => p._id === bookingData.providerId)?.ratePerKgPerDay || 0
                } per kg/day
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setBookingData(prev => ({ ...prev, showModal: false }))}
                disabled={bookingData.bookingInProgress}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBookingSubmit}
                disabled={bookingData.bookingInProgress || !bookingData.capacity}
              >
                {bookingData.bookingInProgress ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StorageCard({ provider, onBookNow }) {
  const getTypeIcon = () => {
    if (provider.type === "Cold" || provider.type === "Both") {
      return <Refrigerator size={16} className="text-blue-500" />;
    }
    return (
      <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    );
  };

  const getTypeColor = () => {
    switch (provider.type) {
      case "Cold":
        return "bg-blue-100 text-blue-600";
      case "Dry":
        return "bg-yellow-100 text-yellow-600";
      case "Both":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const availabilityPercentage =
    provider.capacity && provider.availableCapacity !== undefined
      ? (provider.availableCapacity / provider.capacity) * 100
      : 0;

  const displayRating = provider.rating && parseFloat(provider.rating) > 0 
    ? parseFloat(provider.rating).toFixed(1) 
    : null;

  const displayDistance = provider.distance 
    ? `${Number(provider.distance).toFixed(1)} km`
    : null;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getTypeIcon()}
              <h3 className="font-semibold text-lg text-gray-900">{provider.name}</h3>
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`text-xs ${getTypeColor()}`}>
                {provider.type} Storage
              </Badge>

              {displayRating && (
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-500 mr-1 fill-current" />
                  <span className="text-sm text-gray-600">{displayRating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin size={14} className="mr-2 flex-shrink-0" />
            <span className="flex-1">{provider.location}</span>
            {displayDistance && (
              <span className="text-gray-500 font-medium">{displayDistance}</span>
            )}
          </div>

          {provider.contact && (
            <div className="flex items-center text-gray-600">
              <Phone size={14} className="mr-2 flex-shrink-0" />
              <span>{provider.contact}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Rate per kg/day:</span>
            <span className="font-bold text-lg text-green-600">
              ₹{Number(provider.ratePerKgPerDay || 0).toFixed(2)}
            </span>
          </div>

          {provider.capacity && provider.availableCapacity !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">Available Capacity</span>
                <span>
                  {provider.availableCapacity} / {provider.capacity} kg
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className={`rounded-full h-3 transition-all duration-500 ${
                    availabilityPercentage > 70 
                      ? 'bg-green-500' 
                      : availabilityPercentage > 30 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(availabilityPercentage, 100)}%` }}
                />
              </div>
              {provider.availableCapacity === 0 && (
                <div className="text-sm text-red-500 mt-1 font-medium">
                  ⚠️ No capacity available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Amenities */}
        {provider.amenities && provider.amenities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Amenities:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {provider.amenities.slice(0, 4).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {provider.amenities.length > 4 && (
                <Badge variant="outline" className="text-xs bg-gray-100">
                  +{provider.amenities.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={provider.availableCapacity === 0}
            onClick={() => onBookNow(provider._id)}
          >
            {provider.availableCapacity === 0 ? 'Not Available' : 'Book now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BookedStorageCard({ booking }) {
  return (
    <Card className="border-green-100 bg-green-50 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <Box className="text-green-500 mr-2 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-lg">{booking.providerName}</h3>
            <p className="text-sm text-gray-600">{booking.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Booked Capacity</p>
            <p className="font-medium">{booking.bookedCapacity} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Daily Rate</p>
            <p className="font-medium">₹{booking.ratePerKgPerDay}/kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Daily Cost</p>
            <p className="font-bold text-green-600">
              ₹{(booking.bookedCapacity * booking.ratePerKgPerDay).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Booked On</p>
            <p className="font-medium">
              {new Date(booking.bookingDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {booking.amenities?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
            <div className="flex flex-wrap gap-2">
              {booking.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}